export const startParamToRoute = {
  home: "/",
  games: "/games",
  rank: "/leaderboard",
  leaderboard: "/leaderboard",
  profile: "/profile",
  me: "/profile",
  game_turtle: "/play/turtle-race",
  game_turtle_race: "/play/turtle-race",
  game_merge: "/play/merge-turtle",
  game_merge_turtle: "/play/merge-turtle",
  game_basketball: "/play/street-basketball",
  game_street_basketball: "/play/street-basketball",
} as const;

export type KnownStartParam = keyof typeof startParamToRoute;

export function resolveStartParamRoute(startParam: string | null | undefined) {
  if (!startParam) return null;

  const normalized = startParam.trim().toLowerCase();
  return startParamToRoute[normalized as KnownStartParam] ?? null;
}

export function normalizeStartParam(startParam: string | null | undefined) {
  return startParam?.trim().toLowerCase() ?? null;
}
