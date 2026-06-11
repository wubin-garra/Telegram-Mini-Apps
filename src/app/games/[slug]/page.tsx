import Link from "next/link";
import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { TelegramShell } from "@/components/telegram-shell";
import { Tooltip } from "@/components/tooltip";
import { games, getGame } from "@/lib/games";

type GameDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GameDetailPageProps) {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) {
    return { title: "Game Not Found | Telegram Arcade" };
  }

  return {
    title: `${game.title} | Telegram Arcade`,
    description: game.description,
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) notFound();

  return (
    <TelegramShell>
      <main className="page">
        <section
          className="detail-hero"
          style={
            {
              "--game-accent": game.accent,
              "--game-accent-soft": game.accentSoft,
            } as React.CSSProperties
          }
        >
          <div className="detail-hero__header">
            <Link href="/games" className="detail-back">
              ← Back to catalog
            </Link>
            <span className={`game-card__status game-card__status--${game.status}`}>
              {game.status}
            </span>
          </div>
          <div className="detail-hero__main">
            <div className="detail-hero__title">
              <span className="detail-hero__emoji">{game.emoji}</span>
              <div>
                <span className="eyebrow">
                  {game.eyebrow}
                  <Tooltip label={`${game.title} about`} content={game.tooltip} />
                </span>
                <h1>{game.title}</h1>
                <p>{game.description}</p>
              </div>
            </div>
            <div className="detail-hero__stats">
              <div>
                <span>Time</span>
                <strong>{game.sessionLength}</strong>
              </div>
              <div>
                <span>Style</span>
                <strong>{game.audience}</strong>
              </div>
            </div>
          </div>
          <div className="detail-hero__actions">
            <Link className="button button--primary" href={`/play/${game.slug}`}>
              Play now
            </Link>
          </div>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <span className="eyebrow">Why It Works</span>
            <h2>{game.currentBest}</h2>
            <p>{game.challenge}</p>
            <div className="game-card__tags">
              {game.tags.map((tag) => (
                <span key={tag} className="game-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <article className="detail-card">
            <span className="eyebrow">
              Notes
              <Tooltip
                label="Build note"
                content="The UI stays intentionally light. Deep links handle sharing outside the visible interface."
              />
            </span>
            <h2>Quick start</h2>
            <p>Open the game, finish a round, then share its deep link in chat.</p>
            <div className="detail-note-list">
              <span>{game.eyebrow}</span>
              <span>{game.sessionLength}</span>
              <span>{game.status}</span>
            </div>
          </article>
        </section>
      </main>
      <AppNav />
    </TelegramShell>
  );
}
