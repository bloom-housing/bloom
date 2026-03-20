#!/bin/sh
# Polls the Grafana API and writes dashboard JSON files back to the mounted volume.
# This enables a "save in UI → saved to git repo" workflow.

GRAFANA_URL="${GRAFANA_URL:-http://grafana:3300}"
DASHBOARDS_DIR="${DASHBOARDS_DIR:-/dashboards}"
INTERVAL="${SYNC_INTERVAL:-10}"

echo "Waiting for Grafana to be ready..."
until wget -qO /dev/null "${GRAFANA_URL}/api/health" 2>/dev/null; do
  sleep 2
done
echo "Grafana is ready. Syncing dashboards every ${INTERVAL}s to ${DASHBOARDS_DIR}."

while true; do
  # Get all dashboard UIDs via the search API
  uids=$(wget -qO - "${GRAFANA_URL}/api/search?type=dash-db" | \
    sed 's/},{/}\n{/g' | grep -o '"uid":"[^"]*"' | cut -d'"' -f4)

  for uid in $uids; do
    # Fetch the full dashboard JSON
    raw=$(wget -qO - "${GRAFANA_URL}/api/dashboards/uid/${uid}")

    # Extract the dashboard object, strip runtime fields (id, version), and pretty-print.
    # Use the dashboard title (slugified) as the filename.
    echo "$raw" | python3 -c "
import sys, json
data = json.load(sys.stdin)
dash = data.get('dashboard', {})
# Remove server-side fields so the file is portable
dash.pop('id', None)
dash.pop('version', None)
title = dash.get('title', '${uid}')
# Slugify: lowercase, replace non-alphanum with dashes
slug = ''.join(c if c.isalnum() else '-' for c in title.lower()).strip('-')
filename = '${DASHBOARDS_DIR}/' + slug + '.json'
with open(filename, 'w') as f:
    json.dump(dash, f, indent=2)
    f.write('\n')
print('Synced: ' + title + ' -> ' + filename)
"
  done

  sleep "$INTERVAL"
done
