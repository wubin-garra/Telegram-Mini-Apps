# Telegram Arcade

Telegram Mini App skeleton for Garra's game catalog.

## Goal

This project is the new host shell for:

- Turtle Race
- Merge Turtle
- Street Basketball

It is designed as a single Telegram Main Mini App with:

- a mobile-first arcade lobby
- game detail routes
- leaderboard and profile shells
- official Telegram WebApp script loading
- server-side `initData` validation
- API placeholders for scores and leaderboard data

## Run

```bash
npm install
npm run sync:games
npm run dev
```

Open:

```text
http://localhost:3000
```

Play routes:

```text
http://localhost:3000/play/turtle-race
http://localhost:3000/play/merge-turtle
http://localhost:3000/play/street-basketball
```

## Current Structure

```text
src/
  app/
    page.tsx                  # lobby / home
    games/
      page.tsx                # game catalog
      [slug]/page.tsx         # game detail route
    leaderboard/page.tsx
    profile/page.tsx
    api/
      telegram/auth/route.ts
      scores/route.ts
      leaderboard/route.ts
  components/
    app-nav.tsx
    game-card.tsx
    telegram-shell.tsx
    profile-overview.tsx
  lib/
    games.ts                  # game manifest
    telegram.ts               # Telegram SDK helpers
    telegram-init-data.ts     # server-side initData validation
    startapp.ts               # startapp route resolution
```

## Telegram Entry

Create `.env.local`:

```bash
cp .env.example .env.local
```

Then set:

```bash
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_APP_URL=https://your-domain.com
TELEGRAM_BOT_TOKEN=123456:replace_with_real_bot_token
TELEGRAM_INIT_DATA_MAX_AGE_SECONDS=3600
```

Supported `startapp` values:

- `home`
- `games`
- `rank`
- `profile`
- `game_turtle`
- `game_merge`
- `game_basketball`

Detailed bot setup notes:

- [telegram-bot-setup.md](/Users/garra/Desktop/claude/telegram-arcade/docs/telegram-bot-setup.md)

## What Makes It A Real Mini App

This project now does the minimum required Telegram handshake:

- loads Telegram's official `telegram-web-app.js` in the document head
- reads `window.Telegram.WebApp.initData` inside the client shell
- posts `initData` to `/api/telegram/auth`
- validates the payload signature on the server using `TELEGRAM_BOT_TOKEN`
- rejects stale or unsigned sessions before trusting the user object

If you open the app in a normal browser, it stays in preview mode. Open it from your bot inside Telegram to get a verified session.

## Release Path

1. Deploy the app to a public HTTPS URL such as `https://arcade.yourdomain.com`.
2. Set the same URL as your Main Mini App and menu button URL in `@BotFather`.
3. Add the production bot username and bot token to your deployment environment.
4. Test these links inside Telegram:
   - `https://t.me/your_bot_username?startapp=home`
   - `https://t.me/your_bot_username?startapp=game_turtle`
   - `https://t.me/your_bot_username?startapp=game_merge`
   - `https://t.me/your_bot_username?startapp=game_basketball`

## Existing Game Sources

The current game files still live outside this app:

- `/Users/garra/Desktop/claude/projects/turtle-race/turtle-race.html`
- `/Users/garra/Desktop/claude/projects/merge-turtle/merge-turtle.html`
- `/Users/garra/Desktop/claude/projects/street-basketball/street-basketball.html`

They are referenced in `src/lib/games.ts` so the Mini App can be wired to them later.

## Next Steps

1. Add a database for users, sessions, scores, and invites.
2. Add result reporting from each game back into the Mini App shell.
3. Configure BotFather menu button and Main Mini App URL in production.
4. Add share actions that emit direct `startapp` game links after each round.
5. Replace placeholder profile stats with real account and score data.
