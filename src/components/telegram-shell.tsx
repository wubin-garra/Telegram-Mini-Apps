"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getTelegramStartParam,
  getTelegramUserInitial,
  getTelegramUserLabel,
  getTelegramWebApp,
  type TelegramThemeParams,
  type TelegramUser,
} from "@/lib/telegram";
import { StartappRouter } from "@/components/startapp-router";

type TelegramShellProps = {
  children: React.ReactNode;
};

type TelegramAuthState =
  | "preview"
  | "checking"
  | "verified"
  | "failed"
  | "missing_init_data"
  | "missing_bot_token";

export type TelegramSession = {
  isMiniApp: boolean;
  startParam: string | null;
  user: TelegramUser | null;
  themeParams: TelegramThemeParams | null;
  authState: TelegramAuthState;
  authMessage: string | null;
  initDataPresent: boolean;
};

function applyTheme(themeParams: TelegramThemeParams | null) {
  if (!themeParams) return;

  const root = document.documentElement;

  for (const [key, value] of Object.entries(themeParams)) {
    if (!value) continue;
    root.style.setProperty(`--tg-${key.replace(/_/g, "-")}`, value);
  }
}

const TelegramSessionContext = createContext<TelegramSession | null>(null);

export function useTelegramSession() {
  return useContext(TelegramSessionContext);
}

export function TelegramShell({ children }: TelegramShellProps) {
  const [state, setState] = useState<TelegramSession>(() => {
    if (typeof window === "undefined") {
      return {
        isMiniApp: false,
        startParam: null,
        user: null,
        themeParams: null,
        authState: "preview",
        authMessage: null,
        initDataPresent: false,
      };
    }

    const webApp = getTelegramWebApp();
    const searchParams = new URLSearchParams(window.location.search);

    if (!webApp) {
      return {
        isMiniApp: false,
        startParam: getTelegramStartParam(searchParams),
        user: null,
        themeParams: null,
        authState: "preview",
        authMessage: "Running in normal browser preview mode.",
        initDataPresent: false,
      };
    }

    return {
      isMiniApp: true,
      startParam: getTelegramStartParam(searchParams),
      user: webApp.initDataUnsafe?.user ?? null,
      themeParams: webApp.themeParams ?? null,
      authState: webApp.initData ? "checking" : "missing_init_data",
      authMessage: webApp.initData
        ? "Checking Telegram session..."
        : "Mini App opened without initData.",
      initDataPresent: Boolean(webApp.initData),
    };
  });

  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (!webApp) return;

    webApp.ready();
    webApp.expand?.();
    webApp.disableVerticalSwipes?.();
    webApp.enableClosingConfirmation?.();
    webApp.setHeaderColor?.("#0c101a");
    webApp.setBackgroundColor?.("#080b12");
    applyTheme(state.themeParams);
  }, [state.themeParams]);

  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (!webApp?.initData) return;
    const initData = webApp.initData;

    let ignore = false;

    async function authenticate() {
      try {
        const response = await fetch("/api/telegram/auth", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            initData,
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | {
              ok?: boolean;
              user?: TelegramUser | null;
              startParam?: string | null;
              message?: string;
              code?: string;
            }
          | null;

        if (ignore) return;

        if (response.ok && payload?.ok) {
          setState((current) => ({
            ...current,
            authState: "verified",
            authMessage: "Telegram session verified.",
            startParam: payload.startParam ?? current.startParam,
            user: payload.user ?? current.user,
          }));
          return;
        }

        const authState =
          payload?.code === "BOT_TOKEN_MISSING" ? "missing_bot_token" : "failed";

        setState((current) => ({
          ...current,
          authState,
          authMessage: payload?.message ?? "Telegram session validation failed.",
        }));
      } catch {
        if (ignore) return;
        setState((current) => ({
          ...current,
          authState: "failed",
          authMessage: "Network error while validating Telegram session.",
        }));
      }
    }

    authenticate();

    return () => {
      ignore = true;
    };
  }, []);

  const banner = useMemo(() => {
    if (!state.isMiniApp) {
      return "Web preview mode";
    }

    const prefix =
      state.authState === "verified"
        ? "Telegram verified"
        : state.authState === "checking"
          ? "Checking Telegram session"
          : state.authState === "missing_bot_token"
            ? "Bot token missing on server"
            : state.authState === "missing_init_data"
              ? "Mini App missing initData"
              : "Telegram validation failed";

    return `${prefix}${state.startParam ? ` • startapp=${state.startParam}` : ""}`;
  }, [state.authState, state.isMiniApp, state.startParam]);

  const userLabel = getTelegramUserLabel(state.user);
  const userInitial = getTelegramUserInitial(state.user);
  const shellStatusClassName = `shell-pill shell-pill--${state.authState.replaceAll("_", "-")}`;

  return (
    <TelegramSessionContext.Provider value={state}>
      <div className="shell-frame">
        <StartappRouter startParam={state.startParam} />
        <div className="shell-status">
          <div className="shell-status__left">
            <span className={shellStatusClassName}>{banner}</span>
            {state.authMessage ? (
              <span className="shell-note">{state.authMessage}</span>
            ) : null}
          </div>
          <span className="shell-user">
            <span className="shell-user__avatar">{userInitial}</span>
            {userLabel}
          </span>
        </div>
        {children}
      </div>
    </TelegramSessionContext.Provider>
  );
}
