export type TelegramThemeParams = Partial<{
  bg_color: string;
  secondary_bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  bottom_bar_bg_color: string;
  header_bg_color: string;
  section_bg_color: string;
  section_separator_color: string;
}>;

export type TelegramUser = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export type TelegramInitDataUnsafe = {
  auth_date?: number;
  chat_instance?: string;
  chat_type?: string;
  query_id?: string;
  receiver?: TelegramUser;
  start_param?: string;
  user?: TelegramUser;
};

export type TelegramWebApp = {
  ready: () => void;
  expand?: () => void;
  disableVerticalSwipes?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  enableClosingConfirmation?: () => void;
  onEvent?: (eventType: string, eventHandler: () => void) => void;
  offEvent?: (eventType: string, eventHandler: () => void) => void;
  themeParams?: TelegramThemeParams;
  colorScheme?: "light" | "dark";
  version?: string;
  platform?: string;
  initData?: string;
  initDataUnsafe?: TelegramInitDataUnsafe;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function getTelegramStartParam(searchParams?: URLSearchParams) {
  const webApp = getTelegramWebApp();

  return (
    searchParams?.get("tgWebAppStartParam") ??
    webApp?.initDataUnsafe?.start_param ??
    null
  );
}

export function getTelegramUserLabel(user?: TelegramUser | null) {
  if (!user) return "Guest Pilot";
  if (user.first_name) return user.first_name;
  if (user.username) return `@${user.username}`;
  return "Guest Pilot";
}

export function getTelegramUserInitial(user?: TelegramUser | null) {
  const source = user?.first_name ?? user?.username ?? "G";
  return source.slice(0, 1).toUpperCase();
}
