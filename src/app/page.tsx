import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { GameCard } from "@/components/game-card";
import { TelegramShell } from "@/components/telegram-shell";
import { featuredGame, games } from "@/lib/games";
import { resolveStartParamRoute } from "@/lib/startapp";
import { Tooltip } from "@/components/tooltip";

const quickStats = [
  { label: "Games", value: "3" },
  { label: "Loop", value: "Play • Score • Share" },
  { label: "Feel", value: "Fast mobile sessions" },
];

type HomePageProps = {
  searchParams: Promise<{
    startapp?: string;
    tgWebAppStartParam?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const startParam =
    resolvedSearchParams.tgWebAppStartParam ?? resolvedSearchParams.startapp ?? null;
  const startRoute = resolveStartParamRoute(startParam);

  if (startRoute && startRoute !== "/") {
    redirect(startRoute);
  }

  return (
    <TelegramShell>
      <main className="page page--home">
        <section className="hero-panel">
          <div className="hero-panel__copy">
            <span className="eyebrow">Garra Arcade</span>
            <h1>Tap in. Pick a game. Challenge your friends.</h1>
            <p>
              Three quick games, built for short Telegram sessions and easy sharing.
            </p>
            <div className="hero-panel__actions">
              <Link className="button button--primary" href={`/play/${featuredGame.slug}`}>
                Play {featuredGame.title}
              </Link>
              <Link className="button button--ghost" href="/games">
                See all games
              </Link>
            </div>
            <div className="hero-stats">
              {quickStats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-panel__side">
            <div className="signal-card">
              <div className="signal-card__label">Featured</div>
              <div className="signal-card__value">{featuredGame.title}</div>
              <p>{featuredGame.challenge}</p>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <span className="eyebrow">
              Games
              <Tooltip
                label="About these games"
                content="This build keeps the lobby simple. Extra product notes are hidden so the first screen stays focused on play."
              />
            </span>
            <h2>Quick picks</h2>
          </div>
          <div className="game-grid">
            {games.map((game, index) => (
              <GameCard key={game.slug} game={game} priority={index === 0} />
            ))}
          </div>
        </section>
      </main>
      <AppNav />
    </TelegramShell>
  );
}
