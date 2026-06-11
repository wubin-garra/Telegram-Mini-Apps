import Link from "next/link";
import type { ArcadeGame } from "@/lib/games";
import { Tooltip } from "@/components/tooltip";

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
        <span className="game-card__eyebrow">
          {game.eyebrow}
          <Tooltip label={`${game.title} details`} content={game.tooltip} />
        </span>
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
        <span>{game.audience}</span>
        <span>{game.sessionLength}</span>
      </div>
      <div className="game-card__tags">
        {game.tags.map((tag) => (
          <span key={tag} className="game-card__tag">
            {tag}
          </span>
        ))}
      </div>
      <p className="game-card__callout">{game.currentBest}</p>
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
