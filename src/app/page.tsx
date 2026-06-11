import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { GameCard } from "@/components/game-card";
import { TelegramShell } from "@/components/telegram-shell";
import { featuredGame, games } from "@/lib/games";
import { resolveStartParamRoute } from "@/lib/startapp";

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
            <h1>Three games. One tap to play.</h1>
            <p>Fast rounds built for Telegram.</p>
            <div className="hero-panel__actions">
              <Link className="button button--primary" href={`/play/${featuredGame.slug}`}>
                Play {featuredGame.title}
              </Link>
              <Link className="button button--ghost" href="/games">
                See all games
              </Link>
            </div>
          </div>
          <div className="hero-panel__side">
            <div className="signal-card">
              <div className="signal-card__label">Start Here</div>
              <div className="signal-card__value">{featuredGame.title}</div>
              <p>{featuredGame.currentBest}</p>
              <Link className="signal-card__link" href={`/play/${featuredGame.slug}`}>
                Open game
              </Link>
            </div>
          </div>
        </section>

        <section className="brand-strip">
          <div className="brand-strip__copy">
            <span className="eyebrow">About AxBlade</span>
            <h2>Accountable AI, at every layer.</h2>
            <p>
              Identity, trusted execution, and accountability infrastructure for
              the AI agent economy.
            </p>
          </div>
          <a
            className="button button--ghost"
            href="https://www.axblade.io/"
            target="_blank"
            rel="noreferrer"
          >
            Visit axblade.io
          </a>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div className="section-heading__copy">
              <span className="eyebrow">Games</span>
              <h2>Quick picks</h2>
              <p>Start with the fastest entry point, then explore the rest.</p>
            </div>
            <Link className="section-heading__link" href="/games">
              Full catalog
            </Link>
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
