# Earthquake Alert Frontend Deployment

## Prerequisites
- Docker & Docker Compose
- Nginx
- External Docker network `earthquake_network`
- API Server and Consumer running (see their respective repositories)

## Setup

1. **Nginx Configuration**:
   - Copy `deploy/nginx/www.quakenow.ovh.conf` to `/etc/nginx/sites-available/`.
   - Symlink to `/etc/nginx/sites-enabled/`.
   - Reload Nginx: `sudo nginx -t && sudo systemctl reload nginx`.

2. **Run Service**:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

3. **Verify**:
   - Frontend should be accessible at `http://www.quakenow.ovh`.
