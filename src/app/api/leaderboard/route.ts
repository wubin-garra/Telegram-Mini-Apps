import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    stage: "skeleton",
    leaderboard: [
      { rank: 1, user: "Rena", game: "Turtle Race", score: 12980 },
      { rank: 2, user: "Kai", game: "Street Basketball", score: 11420 },
      { rank: 3, user: "Mira", game: "Merge Turtle", score: 10775 },
    ],
  });
}
