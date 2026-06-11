# Telegram Bot Setup

This app is prepared for a single Main Mini App bot entry.

## 1. Set bot username in local env

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Fill:

```bash
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_APP_URL=https://your-domain.com
TELEGRAM_BOT_TOKEN=123456:replace_with_real_bot_token
TELEGRAM_INIT_DATA_MAX_AGE_SECONDS=3600
```

Example:

```bash
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=garra_arcade_bot
NEXT_PUBLIC_APP_URL=https://arcade.garra.games
TELEGRAM_INIT_DATA_MAX_AGE_SECONDS=3600
```

`TELEGRAM_BOT_TOKEN` is server-only. Do not expose it through `NEXT_PUBLIC_` variables.

## 2. Main Mini App entry model

Recommended structure:

- Home: `startapp=home`
- Games: `startapp=games`
- Turtle Race: `startapp=game_turtle`
- Merge Turtle: `startapp=game_merge`
- Street Basketball: `startapp=game_basketball`

## 3. Supported startapp routes

| startapp | route |
|---|---|
| `home` | `/` |
| `games` | `/games` |
| `rank` | `/leaderboard` |
| `profile` | `/profile` |
| `game_turtle` | `/play/turtle-race` |
| `game_merge` | `/play/merge-turtle` |
| `game_basketball` | `/play/street-basketball` |

## 4. BotFather setup flow

Use BotFather:

1. Create or open your bot
2. Enable your Main Mini App
3. Upload your public HTTPS root URL, for example:

```text
https://your-domain.com
```

4. Set the menu button to the same root URL
5. Use `Play` as the button label

The app must be reachable over public HTTPS. Telegram will not launch a local `localhost` URL for real users.

For a Main Mini App flow, users open:

```text
https://t.me/your_bot_username?startapp=home
```

Or directly into a game:

```text
https://t.me/your_bot_username?startapp=game_turtle
https://t.me/your_bot_username?startapp=game_merge
https://t.me/your_bot_username?startapp=game_basketball
```

## 5. Menu button recommendation

Set menu button label to:

```text
Play
```

And point it to the app root:

```text
https://your-domain.com
```

## 6. How real user auth works

When the user opens the app inside Telegram:

1. Telegram injects `window.Telegram.WebApp.initData`
2. The app posts it to `/api/telegram/auth`
3. The backend verifies the HMAC signature using `TELEGRAM_BOT_TOKEN`
4. Only after that should you trust the user object or save scores

If you open the site directly in a normal browser, the app stays in preview mode and no Telegram identity is trusted.

## 7. Recommended launch order

1. Deploy app root
2. Set bot username and bot token in your deployment environment
3. Verify `/profile` shows launch links and a verified Telegram session when opened inside Telegram
4. Configure BotFather Main Mini App and menu button
5. Test:
   - `?startapp=home`
   - `?startapp=games`
   - `?startapp=game_turtle`
   - `?startapp=game_merge`
   - `?startapp=game_basketball`
