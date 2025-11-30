# Earthquake Alert Web

Earthquake events are very frequent these days. This web app tracks them in near real‑time with a map, list, filters and alerts.

## Run the project
```bash
npm install
npm run dev
```

## Open the app
- Home (map + “Latest Near Me” banner): `http://localhost:3000/`
- List screen: `http://localhost:3000/earthquakes`

If running with randomized host ports, use:
- Frontend: `http://localhost:48291`
- List: `http://localhost:48291/earthquakes`

## Environment
Set the following environment variables for local dev:
```
NEXT_PUBLIC_API_URL=http://localhost:51763/api
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:51763
NEXT_PUBLIC_MQTT_WS_URL=ws://localhost:47754
NEXT_PUBLIC_MQTT_TOPIC=alerts/earthquake
```

See `.env.example` for a complete template.
