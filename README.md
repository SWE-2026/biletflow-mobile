# BiletFlow Mobile

Event Admin app for BiletFlow, a self-service event ticketing platform for Kazakhstan. Event Admins
sign in, scan ticket QR codes, check attendees in (also offline) and see check-in stats. The app can
also show the BiletFlow web app in a WebView, sharing the same session. Built with Expo and Expo Router.

## Run it

1. Start the API from [`../biletflow-api`](../biletflow-api) (API on http://localhost:8080, in local
   mode):

   ```bash
   docker compose up --build
   ```

2. To use the web app option in the launcher, also start the web app from
   [`../biletflow-frontend`](../biletflow-frontend) (on http://localhost:5173):

   ```bash
   npm install
   npm run dev
   ```

3. Install dependencies and start the app here:

   ```bash
   npm install
   npx expo start
   ```

   In the Expo output, press `i` for the iOS simulator, `a` for the Android emulator or `w` for the
   web, or scan the QR code with Expo Go on a phone. Scanning tickets needs a camera, so test it on a
   phone.

The API runs in local mode, so sign-in codes are not emailed: the app shows them on the verify
screen with a "Local mode" label.

## Pointing the app at the API

Settings are read when the app is bundled. To change them, create `.env.local` (git-ignored) in this
folder and restart `npx expo start`:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api/v1
EXPO_PUBLIC_WEB_URL=http://10.0.2.2:5173
```

| Variable | Default | Meaning |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | API base URL, including `/api/v1` |
| `EXPO_PUBLIC_WEB_URL` | `http://localhost:5173` | where the web app runs, shown in the WebView |

`localhost` only works on the iOS simulator and the web. Elsewhere, use:

| Where the app runs | Host to use |
|---|---|
| iOS simulator, web | `localhost` (the default) |
| Android emulator | `10.0.2.2` |
| Physical phone | your computer's LAN IP, e.g. `192.168.1.20`; the phone must be on the same network |

On a physical phone, start the web app with `npm run dev -- --host` so the phone can reach it. The
web app must use the same API as this app, or the shared session will not work.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | start the Expo dev server |
| `npm run ios` / `npm run android` / `npm run web` | start and open on that platform |
| `npm run lint` | ESLint (`expo lint`) |
| `npx tsc --noEmit` | TypeScript check |
| `npx expo run:ios` / `npx expo run:android` | build and run a development build, for when Expo Go can't open the app |

Do not run `npm run reset-project`. It is left over from the Expo template and moves the app's code
out of the way.

## Project layout

The code is in `src/` and follows [Feature-Sliced Design](https://feature-sliced.design):
`app`, `pages`, `widgets`, `features`, `entities` and `shared`. `src/app/` is also the Expo Router
root, so it holds only route and `_layout.tsx` files. The API contract is in
[`../biletflow-api/docs/api.md`](../biletflow-api/docs/api.md).
