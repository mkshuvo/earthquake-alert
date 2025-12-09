Deployment (HTTP) for quakenow.ovh

Domains:
- www.quakenow.ovh → frontend
- api.quakenow.ovh → API server
- rc.quakenow.ovh → RabbitMQ consumer

Prerequisites:
- DNS A (and AAAA if IPv6) for each subdomain pointing to VPS IP
- Nginx installed on VPS; firewall ports 80 open
- Docker network `earthquake_network` created
- Containers running and exposing host ports:
  - frontend → 48291
  - api → 51763
  - consumer → 8000

Steps:
1) Copy configs in deploy/nginx/*.conf to /etc/nginx/sites-available and symlink to sites-enabled
2) Adjust any paths or ports if different on VPS
3) nginx -t && systemctl reload nginx
4) Set frontend env:
   NEXT_PUBLIC_API_URL=http://api.quakenow.ovh
   NEXT_PUBLIC_WEBSOCKET_URL=http://api.quakenow.ovh
   NEXT_PUBLIC_MQTT_WS_URL=ws://rc.quakenow.ovh/mqtt (optional)
5) Set API env:
   CORS_ORIGIN=http://www.quakenow.ovh

