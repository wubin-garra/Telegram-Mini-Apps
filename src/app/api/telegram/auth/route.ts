import { NextResponse } from "next/server";
import { validateTelegramInitData } from "@/lib/telegram-init-data";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { initData?: string }
    | null;

  const initData = body?.initData?.trim() ?? "";
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const maxAgeSeconds = Number(process.env.TELEGRAM_INIT_DATA_MAX_AGE_SECONDS ?? 3600);

  if (!botToken) {
    return NextResponse.json(
      {
        ok: false,
        code: "BOT_TOKEN_MISSING",
        message:
          "Set TELEGRAM_BOT_TOKEN on the server before trusting Telegram Mini App users.",
      },
      { status: 500 },
    );
  }

  const validation = validateTelegramInitData(initData, {
    botToken,
    maxAgeSeconds: Number.isFinite(maxAgeSeconds) ? maxAgeSeconds : 3600,
  });

  if (!validation.ok) {
    return NextResponse.json(validation, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    authDate: validation.authDate,
    ageSeconds: validation.ageSeconds,
    chatInstance: validation.chatInstance,
    chatType: validation.chatType,
    queryId: validation.queryId,
    startParam: validation.startParam,
    user: validation.user,
  });
}
