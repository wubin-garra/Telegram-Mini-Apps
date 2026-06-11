"use client";

import { useTelegramSession } from "@/components/telegram-shell";
import { getTelegramUserInitial, getTelegramUserLabel } from "@/lib/telegram";

const profileStats = [
  { label: "Games ready", value: "3" },
  { label: "Mode", value: "Arcade" },
  { label: "Loop", value: "Play • Share" },
  { label: "Status", value: "Mobile-first" },
];

function getProfileStatus(authState: string) {
  switch (authState) {
    case "verified":
      return "Telegram account verified";
    case "checking":
      return "Checking Telegram account";
    case "missing_bot_token":
      return "Server still needs TELEGRAM_BOT_TOKEN";
    case "failed":
      return "Session needs a fresh Telegram launch";
    case "missing_init_data":
      return "Open from Telegram to attach identity";
    default:
      return "Browser preview mode";
  }
}

export function ProfileOverview() {
  const session = useTelegramSession();
  const user = session?.user ?? null;
  const authState = session?.authState ?? "preview";
  const authMessage = session?.authMessage ?? "Open the Mini App inside Telegram.";

  return (
    <>
      <section className="page-header">
        <span className="eyebrow">Profile</span>
        <h1>Account and progress</h1>
        <p>
          Keep this page simple inside Telegram: identity, session health, and the
          next action back into a game.
        </p>
      </section>

      <section className="profile-shell">
        <article className="profile-card profile-card--hero">
          <div className="profile-avatar">{getTelegramUserInitial(user)}</div>
          <div>
            <span className="eyebrow">{getProfileStatus(authState)}</span>
            <h2>{getTelegramUserLabel(user)}</h2>
            <p>{authMessage}</p>
          </div>
        </article>

        <article className="profile-card">
          <span className="eyebrow">Snapshot</span>
          <div className="profile-grid">
            {profileStats.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
