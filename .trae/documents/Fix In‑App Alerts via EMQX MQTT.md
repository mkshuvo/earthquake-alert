## Goals
- Fix map not loading and improve UX.
- Move earthquake list to a dedicated screen and add a “Latest Near Me” banner on the home screen.
- Align web frontend real‑time with your backend “NestJS REST API & WebSocket” (use socket.io client), keep EMQX primarily for mobile.
- Respect port mappings and keep internal Docker networking unchanged.

## Port‑Aware Config
- Frontend (host): `http://localhost:48291`
- Backend API (host): `http://localhost:51763/api`
- Backend WebSocket (host): `http://localhost:51763` (socket.io)
- MQTT WS for mobile: `ws://localhost:47754` (optional fallback for web)
- Internal container networking remains via `ea-worker:6000`, `ea-mqtt:9001`.

## UI Changes
- Fix map init bug in `src/app/components/EarthquakeMap.tsx`:
  - Initialize map even when there are 0 earthquakes (remove `!earthquakes.length` guard at `:39`).
  - Keep current center fallback logic (`:68-75`) and user location handling (`:21-35`).
- Create dedicated list screen: `src/app/earthquakes/page.tsx` that renders `EarthquakeList`.
  - Update header in `src/app/page.tsx:87-105` with a “Earthquakes” button to navigate to `/earthquakes`.
- Add “Latest Near Me” banner on home:
  - New component `LatestNearMeBanner` that:
    - Gets user location (reuse geolocation logic from `EarthquakeMap.tsx:21-35`).
    - Computes nearest recent earthquake using Haversine distance over `useEarthquakes()`.
    - Shows magnitude, place, time, distance, and a link to details.
  - Render it above the bottom section on home, just under the header.

## Real‑Time Workflow (Web)
- Implement true socket.io client in `src/services/realtimeService.ts`:
  - Connect to `process.env.NEXT_PUBLIC_WEBSOCKET_URL` (host `http://localhost:51763`).
  - Subscribe to backend earthquake events (e.g., `earthquake:new`, `earthquakes:bulk`).
  - On event: normalize payload → `addEarthquake` (`src/store/earthquakeStore.ts:82`) and update `serverStatus` (`:96`).
  - Reconnect/backoff, connectivity flags, and last update timestamps.
- Replace/merge current polling (`websocketService.ts`) with socket.io events; keep polling as fallback.
- Optional EMQX fallback for web:
  - Add `mqttService.ts` with WS URL `ws://localhost:47754` and configurable topic; use only if socket.io is unavailable.

## Store Enhancements
- Extend `ServerStatus` (`src/store/earthquakeStore.ts:33`) with:
  - `socketConnected: boolean`, `mqttConnected: boolean`, `lastRealtimeUpdate: Date|null`.
- Add selector to compute nearest earthquake to a given lat/lng for the banner.

## Environment Variables
- `.env` (local dev):
  - `NEXT_PUBLIC_API_URL=http://localhost:51763/api`
  - `NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:51763`
  - Optional (web fallback): `NEXT_PUBLIC_MQTT_WS_URL=ws://localhost:47754`
- Docker (containers): keep internal `ea-worker:6000` and add `NEXT_PUBLIC_WEBSOCKET_URL=http://ea-worker:6000` for socket.io within the network.

## Documentation
- Update `README.md`, `QUICK_START_GUIDE.md`, and repo wiki:
  - Add new routes (`/earthquakes`), banner behavior, and real‑time via socket.io.
  - Clarify EMQX is primarily for mobile; web uses socket.io with polling fallback.
  - Include the port map you provided and env examples.

## Tests & Verification
- Unit tests: nearest earthquake selector, realtime event handlers, and reconnection state updates.
- Integration: simulate socket.io events from backend; verify list updates, banner content, and connection status indicators.
- Manual: open `http://localhost:48291`, confirm map renders without data, banner shows nearest event once geolocation is available, and list route works.

## Security & Clean‑up
- Remove `GOOGLE_API` from committed envs; provide `.env.example`.
- Keep `.gitignore` covering secrets; ensure no secrets in repo.

## References
- Map init guard to change: `src/app/components/EarthquakeMap.tsx:39`.
- Home header area for navigation: `src/app/page.tsx:87-105`.
- Store actions/selectors: `src/store/earthquakeStore.ts:79-111`, `:148-168`.
- Current polling service: `src/services/websocketService.ts:9-33`, `:35-67`, `:69-78`.
- SSE route (unchanged, optional bridge): `src/app/api/earthquakes/stream/route.ts:7-41`.
- Repo wiki alignment: `.qoder/repowiki/en/content/Real-time Data System.md`.

## Approval
- Approve to implement the UI fixes (map, dedicated list screen, “Latest Near Me” banner), add socket.io real‑time for web aligned to your backend, keep EMQX primarily for mobile, update envs/docs, and add tests. I will deliver and verify end‑to‑end behavior with your port mappings.