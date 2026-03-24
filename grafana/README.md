# Grafana

This directory contains Grafana configs used by [docker compose](../docker-compose.yml). To start
Grafana, run `COMPOSE_PROFILES=observability docker compose up`. Grafana will be available at
http://localhost:3300/.

## Updating dashboards

Make the dashboard edits in the Grafana web UI, then click the 'Save dashboard' button. Once the
dashboard is saved in the web UI, sync the changes to the git repo by running `docker compose
restart grafana-sync`.
