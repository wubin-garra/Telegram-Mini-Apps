import Link from "next/link";
import { notFound } from "next/navigation";
import { Tooltip } from "@/components/tooltip";
import { games, getGame } from "@/lib/games";

type PlayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) {
    return { title: "Play | Telegram Arcade" };
  }

  return {
    title: `Play ${game.title} | Telegram Arcade`,
    description: game.description,
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) notFound();

  const src = `/legacy-games/${game.slug}/index.html`;

  return (
    <main className="play-page">
      <header className="play-header">
        <div className="play-header__left">
          <Link href="/games" className="button button--ghost button--compact">
            Back
          </Link>
          <div className="play-header__title">
            <span className="play-header__emoji" aria-hidden="true">
              {game.emoji}
            </span>
            <div>
              <span className="eyebrow">
                {game.eyebrow}
                <Tooltip label={`${game.title} launch note`} content={game.tooltip} />
              </span>
              <strong>{game.title}</strong>
            </div>
          </div>
        </div>
        <div className="play-header__right">
          <Link href={`/games/${game.slug}`} className="button button--ghost button--compact">
            Details
          </Link>
        </div>
      </header>

      <section className="play-frame-wrap">
        <iframe
          key={src}
          title={`${game.title} game`}
          src={src}
          className="play-frame"
          allow="autoplay; fullscreen"
        />
      </section>
    </main>
  );
}
