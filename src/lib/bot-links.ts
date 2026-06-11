import { resolveStartParamRoute } from "@/lib/startapp";

export const telegramBotUsername =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "";

const gameStartParams = {
  "turtle-race": "game_turtle",
  "merge-turtle": "game_merge",
  "street-basketball": "game_basketball",
} as const;

export function hasTelegramBotConfig() {
  return telegramBotUsername.length > 0;
}

export function buildMainMiniAppLink(startParam?: string) {
  if (!telegramBotUsername) return null;

  const base = `https://t.me/${telegramBotUsername}`;
  if (!startParam) return `${base}?startapp`;
  return `${base}?startapp=${encodeURIComponent(startParam)}`;
}

export function getGameStartParam(slug: string) {
  return gameStartParams[slug as keyof typeof gameStartParams] ?? null;
}

export function getGameTelegramLink(slug: string) {
  const startParam = getGameStartParam(slug);
  if (!startParam) return null;
  return buildMainMiniAppLink(startParam);
}

export function buildTelegramShareLink({
  url,
  text,
}: {
  url: string;
  text: string;
}) {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export function buildGameShareText(title: string, challenge: string) {
  return `${title}: ${challenge}`;
}

export function getBotEntryMap() {
  return [
    { label: "Home", startParam: "home", route: resolveStartParamRoute("home") },
    { label: "Games", startParam: "games", route: resolveStartParamRoute("games") },
    {
      label: "Turtle Race",
      startParam: "game_turtle",
      route: resolveStartParamRoute("game_turtle"),
    },
    {
      label: "Merge Turtle",
      startParam: "game_merge",
      route: resolveStartParamRoute("game_merge"),
    },
    {
      label: "Street Basketball",
      startParam: "game_basketball",
      route: resolveStartParamRoute("game_basketball"),
    },
  ];
}
