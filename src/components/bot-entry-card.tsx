import Link from "next/link";
import {
  buildMainMiniAppLink,
  getBotEntryMap,
  hasTelegramBotConfig,
  telegramBotUsername,
} from "@/lib/bot-links";

export function BotEntryCard() {
  const hasConfig = hasTelegramBotConfig();
  const entries = getBotEntryMap();

  return (
    <section className="bot-entry-card">
      <div className="bot-entry-card__header">
        <div>
          <span className="eyebrow">Bot Entry</span>
          <h2>Telegram launch links</h2>
        </div>
        <span className={`bot-badge${hasConfig ? " is-ready" : ""}`}>
          {hasConfig ? `@${telegramBotUsername}` : "Set bot username"}
        </span>
      </div>

      <p className="bot-entry-card__copy">
        Use Main Mini App + menu button for the default entry, then share `startapp`
        links to jump straight into a game.
      </p>

      <div className="bot-entry-list">
        {entries.map((entry) => {
          const href = buildMainMiniAppLink(entry.startParam) ?? "#";

          return (
            <div key={entry.startParam} className="bot-entry-row">
              <div>
                <strong>{entry.label}</strong>
                <span>{entry.startParam}</span>
              </div>
              {hasConfig ? (
                <Link className="button button--ghost button--compact" href={href}>
                  Open
                </Link>
              ) : (
                <span className="bot-entry-route">{entry.route}</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
