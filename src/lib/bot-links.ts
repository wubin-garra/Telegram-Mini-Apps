import { resolveStartParamRoute } from "@/lib/startapp";

export const telegramBotUsername =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "";

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
  switch (slug) {
    case "turtle-race":
      return "game_turtle";
    case "merge-turtle":
      return "game_merge";
    case "street-basketball":
      return "game_basketball";
    default:
      return null;
  }
}

export function getGameTelegramLink(slug: string) {
  const startParam = getGameStartParam(slug);
  if (!startParam) return null;
  return buildMainMiniAppLink(startParam);
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
