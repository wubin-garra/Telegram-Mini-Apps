import { createHmac, timingSafeEqual } from "node:crypto";
import type { TelegramUser } from "@/lib/telegram";

const DEFAULT_MAX_AGE_SECONDS = 60 * 60;

export type TelegramInitDataErrorCode =
  | "MISSING_INIT_DATA"
  | "MISSING_HASH"
  | "INVALID_HASH"
  | "INVALID_AUTH_DATE"
  | "EXPIRED"
  | "INVALID_USER";

export type TelegramInitDataValidationResult =
  | {
      ok: true;
      authDate: number;
      ageSeconds: number;
      chatInstance: string | null;
      chatType: string | null;
      queryId: string | null;
      startParam: string | null;
      user: TelegramUser | null;
    }
  | {
      ok: false;
      code: TelegramInitDataErrorCode;
      message: string;
    };

type ValidateTelegramInitDataOptions = {
  botToken: string;
  maxAgeSeconds?: number;
  now?: number;
};

function buildDataCheckString(searchParams: URLSearchParams) {
  const pairs = Array.from(searchParams.entries())
    .filter(([key]) => key !== "hash" && key !== "signature")
    .map(([key, value]) => `${key}=${value}`)
    .sort((a, b) => a.localeCompare(b));

  return pairs.join("\n");
}

function parseTelegramUser(userRaw: string | null) {
  if (!userRaw) return { user: null as TelegramUser | null, error: null };

  try {
    return {
      user: JSON.parse(userRaw) as TelegramUser,
      error: null,
    };
  } catch {
    return {
      user: null,
      error: {
        ok: false as const,
        code: "INVALID_USER" as const,
        message: "Telegram user payload is not valid JSON.",
      },
    };
  }
}

export function validateTelegramInitData(
  initData: string,
  options: ValidateTelegramInitDataOptions,
): TelegramInitDataValidationResult {
  if (!initData) {
    return {
      ok: false,
      code: "MISSING_INIT_DATA",
      message: "No Telegram initData was provided.",
    };
  }

  const searchParams = new URLSearchParams(initData);
  const hash = searchParams.get("hash");

  if (!hash) {
    return {
      ok: false,
      code: "MISSING_HASH",
      message: "Telegram initData is missing the hash parameter.",
    };
  }

  const dataCheckString = buildDataCheckString(searchParams);
  const secretKey = createHmac("sha256", "WebAppData")
    .update(options.botToken)
    .digest();
  const computedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const receivedHash = Buffer.from(hash, "hex");
  const expectedHash = Buffer.from(computedHash, "hex");

  if (
    receivedHash.length !== expectedHash.length ||
    !timingSafeEqual(receivedHash, expectedHash)
  ) {
    return {
      ok: false,
      code: "INVALID_HASH",
      message: "Telegram initData signature check failed.",
    };
  }

  const authDateRaw = searchParams.get("auth_date");
  const authDate = Number(authDateRaw);

  if (!Number.isFinite(authDate) || authDate <= 0) {
    return {
      ok: false,
      code: "INVALID_AUTH_DATE",
      message: "Telegram initData auth_date is missing or invalid.",
    };
  }

  const ageSeconds = Math.floor((options.now ?? Date.now()) / 1000) - authDate;
  const maxAgeSeconds = options.maxAgeSeconds ?? DEFAULT_MAX_AGE_SECONDS;

  if (ageSeconds < 0 || ageSeconds > maxAgeSeconds) {
    return {
      ok: false,
      code: "EXPIRED",
      message: "Telegram initData is outside the accepted time window.",
    };
  }

  const parsedUser = parseTelegramUser(searchParams.get("user"));
  if (parsedUser.error) {
    return parsedUser.error;
  }

  return {
    ok: true,
    authDate,
    ageSeconds,
    chatInstance: searchParams.get("chat_instance"),
    chatType: searchParams.get("chat_type"),
    queryId: searchParams.get("query_id"),
    startParam:
      searchParams.get("start_param") ?? searchParams.get("tgWebAppStartParam"),
    user: parsedUser.user,
  };
}
