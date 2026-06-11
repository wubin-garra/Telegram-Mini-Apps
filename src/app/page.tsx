import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
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
            <h1>Fast games for Telegram.</h1>
            <p>Open the lobby, pick a game, and start in seconds.</p>
            <div className="hero-panel__actions">
              <Link className="button button--primary" href={`/play/${featuredGame.slug}`}>
                Play {featuredGame.title}
              </Link>
              <Link className="button button--ghost" href="/games">
                Open lobby
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
            className="button button--brand"
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
              <span className="eyebrow">Jump In</span>
              <h2>Quick launch</h2>
              <p>Use the lobby for full details. Home stays focused on entry.</p>
            </div>
            <Link className="section-heading__link" href="/games">
              View all
            </Link>
          </div>
          <div className="quick-launch-grid">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/play/${game.slug}`}
                className="quick-launch-card"
                style={
                  {
                    "--game-accent": game.accent,
                    "--game-accent-soft": game.accentSoft,
                  } as React.CSSProperties
                }
              >
                <span className="quick-launch-card__emoji" aria-hidden="true">
                  {game.emoji}
                </span>
                <div className="quick-launch-card__copy">
                  <strong>{game.title}</strong>
                  <span>{game.sessionLength}</span>
                </div>
                <span className="quick-launch-card__action">Play</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <AppNav />
    </TelegramShell>
  );
}
