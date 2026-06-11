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

const playNotes = [
  "Short sessions that feel good on mobile.",
  "Clear score or progression goals every round.",
  "Easy to send as a challenge link after playing.",
];

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
                <span>Audience</span>
                <strong>{game.audience}</strong>
              </div>
              <div>
                <span>Session</span>
                <strong>{game.sessionLength}</strong>
              </div>
              <div>
                <span>Best for</span>
                <strong>{game.audience}</strong>
              </div>
            </div>
          </div>
          <div className="detail-hero__actions">
            <Link className="button button--primary" href={`/play/${game.slug}`}>
              Play now
            </Link>
            <button className="button button--ghost" type="button">
              Share soon
            </button>
          </div>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <span className="eyebrow">Why Play</span>
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
            <span className="eyebrow">Quick Notes</span>
            <h2>How this game fits the arcade</h2>
            <ol className="detail-list">
              {playNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>

          <article className="detail-card detail-card--wide">
            <span className="eyebrow">
              More
              <Tooltip
                label="Build note"
                content="Developer-facing migration details are intentionally hidden from the main user flow. Keep the surface focused on play."
              />
            </span>
            <h2>Session snapshot</h2>
            <p>
              The best Mini App version of this game keeps loading short, controls obvious,
              and results easy to share into Telegram chats.
            </p>
            <div className="code-panel">
              <code>game slug: {game.slug}</code>
              <code>session length: {game.sessionLength}</code>
              <code>share loop: play → score → challenge</code>
            </div>
          </article>
        </section>
      </main>
      <AppNav />
    </TelegramShell>
  );
}
