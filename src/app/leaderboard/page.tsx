import { AppNav } from "@/components/app-nav";
import { TelegramShell } from "@/components/telegram-shell";

const leaderboard = [
  { rank: 1, name: "Rena", game: "Turtle Race", score: "12,980" },
  { rank: 2, name: "Kai", game: "Street Basketball", score: "11,420" },
  { rank: 3, name: "Mira", game: "Merge Turtle", score: "10,775" },
  { rank: 4, name: "You", game: "Turtle Race", score: "8,420" },
];

export const metadata = {
  title: "Leaderboard | Telegram Arcade",
};

export default function LeaderboardPage() {
  return (
    <TelegramShell>
      <main className="page">
        <section className="page-header">
          <span className="eyebrow">Leaderboard</span>
          <h1>Competition loop placeholder</h1>
          <p>
            This page is intentionally mocked now. The route exists so the product shell
            and data model can stabilize before you wire a real score backend.
          </p>
        </section>

        <section className="leaderboard-card">
          <div className="leaderboard-head">
            <span>Rank</span>
            <span>Player</span>
            <span>Game</span>
            <span>Score</span>
          </div>
          {leaderboard.map((entry) => (
            <div key={`${entry.rank}-${entry.name}`} className="leaderboard-row">
              <strong>#{entry.rank}</strong>
              <span>{entry.name}</span>
              <span>{entry.game}</span>
              <span>{entry.score}</span>
            </div>
          ))}
        </section>
      </main>
      <AppNav />
    </TelegramShell>
  );
}
