import Link from "next/link";
import type { ArcadeGame } from "@/lib/games";

type GameCardProps = {
  game: ArcadeGame;
  priority?: boolean;
};

export function GameCard({ game, priority = false }: GameCardProps) {
  return (
    <article
      className={`game-card${priority ? " game-card--priority" : ""}`}
      style={
        {
          "--game-accent": game.accent,
          "--game-accent-soft": game.accentSoft,
        } as React.CSSProperties
      }
    >
      <div className="game-card__topline">
        <span className="game-card__eyebrow">{game.eyebrow}</span>
        <span className={`game-card__status game-card__status--${game.status}`}>
          {game.status}
        </span>
      </div>
      <div className="game-card__hero">
        <span className="game-card__emoji" aria-hidden="true">
          {game.emoji}
        </span>
        <div>
          <h2 className="game-card__title">{game.title}</h2>
          <p className="game-card__desc">{game.description}</p>
        </div>
      </div>
      <div className="game-card__meta">
        <span>{game.sessionLength}</span>
        <span>{game.audience}</span>
      </div>
      <div className="game-card__tags">
        {game.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="game-card__tag">
            {tag}
          </span>
        ))}
      </div>
      <p className="game-card__callout">{game.challenge}</p>
      <div className="game-card__actions">
        <Link className="button button--primary" href={`/play/${game.slug}`}>
          Play
        </Link>
        <Link className="button button--ghost" href={`/games/${game.slug}`}>
          Details
        </Link>
      </div>
    </article>
  );
}
