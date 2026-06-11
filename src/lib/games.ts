export type ArcadeGame = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  tooltip: string;
  audience: string;
  sessionLength: string;
  accent: string;
  accentSoft: string;
  emoji: string;
  status: "ready" | "soon";
  tags: string[];
  currentBest: string;
  challenge: string;
};

export const games: ArcadeGame[] = [
  {
    slug: "turtle-race",
    title: "Turtle Race",
    eyebrow: "Flagship Racer",
    description:
      "Pick a turtle, hit the track, and race for the fastest finish.",
    tooltip:
      "Best game for ranked competition, result sharing, and head-to-head friend challenges.",
    audience: "Competitive casuals",
    sessionLength: "3-6 min",
    accent: "#4f8cff",
    accentSoft: "#95b5ff",
    emoji: "🏁",
    status: "ready",
    tags: ["Ranked", "PvP potential", "Share-friendly"],
    currentBest: "Best loop for leaderboards and invite battles",
    challenge: "Beat a friend in one lap and share the result card.",
  },
  {
    slug: "merge-turtle",
    title: "Merge Turtle",
    eyebrow: "Retention Game",
    description:
      "Merge turtles, grow your collection, and come back for better unlocks.",
    tooltip:
      "Best game for daily return loops, streak rewards, and long-term collection progress.",
    audience: "Longer-session collectors",
    sessionLength: "5-12 min",
    accent: "#46c977",
    accentSoft: "#8be2ab",
    emoji: "🐢",
    status: "ready",
    tags: ["Collection", "Daily reward", "Streaks"],
    currentBest: "Best fit for recurring engagement",
    challenge: "Return daily to unlock rare turtles and seasonal drops.",
  },
  {
    slug: "street-basketball",
    title: "Street Basketball",
    eyebrow: "Fast Action",
    description:
      "Swipe, shoot, and stack quick streaks in a fast streetball session.",
    tooltip:
      "Best game for paid traffic or quick shares because the first session is immediate and easy to understand.",
    audience: "Instant-play audience",
    sessionLength: "1-4 min",
    accent: "#ff7a2f",
    accentSoft: "#ffb27d",
    emoji: "🏀",
    status: "ready",
    tags: ["Arcade", "High tempo", "Short sessions"],
    currentBest: "Best for ad deep-links and quick conversion",
    challenge: "Land a streak, post the score, and challenge the chat.",
  },
];

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}

export const featuredGame = games[0];
