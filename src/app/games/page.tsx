import { AppNav } from "@/components/app-nav";
import { GameCard } from "@/components/game-card";
import { TelegramShell } from "@/components/telegram-shell";
import { Tooltip } from "@/components/tooltip";
import { games } from "@/lib/games";

export const metadata = {
  title: "Games | Telegram Arcade",
};

export default function GamesPage() {
  return (
    <TelegramShell>
      <main className="page">
        <section className="page-header">
          <span className="eyebrow">
            Games
            <Tooltip
              label="Games list help"
              content="Each card shows one game, how long a session usually lasts, and what kind of player it fits best."
            />
          </span>
          <h1>Choose your next quick session</h1>
          <p>
            Built for short plays, simple onboarding, and easy challenge sharing.
          </p>
        </section>
        <section className="game-grid">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </section>
      </main>
      <AppNav />
    </TelegramShell>
  );
}
