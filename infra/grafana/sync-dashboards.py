# Formatted with yapf https://github.com/google/yapf with args:
# `--style='{based_on_style:google,SPLIT_BEFORE_FIRST_ARGUMENT:true,COLUMN_LIMIT=100}'`
import argparse
import json
import time
import urllib.request
import urllib.error


def main():
    p = argparse.ArgumentParser(
        prog="sync-dashboards.py",
        description=
        "CLI tool for syncing Grafana dashboards from instance running in docker compose to the git repo.",
        allow_abbrev=True)

    p.add_argument(
        "--grafana_url", help="URL of the grafana instance", default="http://grafana:3300")
    p.add_argument(
        "--dashboards_dir", help="Directory to save dashboards to", default="/dashboards")

    args = p.parse_args()

    wait_for_grafana(args.grafana_url)
    print(f"Syncing dashboards to {args.dashboards_dir}.")

    uids = get_dashboard_uids(args.grafana_url)
    for uid in uids:
        sync_dashboard(args.grafana_url, uid, args.dashboards_dir)


def wait_for_grafana(grafana_url: str) -> None:
    """Wait for Grafana to be ready by polling the health endpoint."""
    print("Waiting for Grafana to be ready...")
    health_url = f"{grafana_url}/api/health"
    while True:
        try:
            with urllib.request.urlopen(health_url, timeout=5) as response:
                if response.status == 200:
                    print("Grafana is ready.")
                    return
        except (urllib.error.URLError, urllib.error.HTTPError):
            pass
        time.sleep(2)


def get_dashboard_uids(grafana_url: str) -> list[str]:
    """Get all dashboard UIDs via the search API."""
    search_url = f"{grafana_url}/api/search?type=dash-db"
    with urllib.request.urlopen(search_url) as response:
        dashboards = json.load(response)
    return [d["uid"] for d in dashboards]


def slugify(title: str) -> str:
    """Slugify: lowercase, replace non-alphanum with dashes."""
    slug = ''.join(c if c.isalnum() else '-' for c in title.lower())
    return slug.strip('-')


def sync_dashboard(grafana_url: str, uid: str, dashboards_dir: str) -> None:
    """Fetch a dashboard by UID, strip runtime fields, and save to file."""
    dashboard_url = f"{grafana_url}/api/dashboards/uid/{uid}"
    with urllib.request.urlopen(dashboard_url) as response:
        data = json.load(response)

    dash = data.get("dashboard", {})
    # Remove server-side fields so the file is portable
    dash.pop("id", None)
    dash.pop("version", None)

    title = dash.get("title", uid)
    slug = slugify(title)
    filename = f"{dashboards_dir}/{slug}.json"

    with open(filename, "w") as f:
        json.dump(dash, f, indent=2)
        f.write("\n")

    print(f"Synced: {title} -> {filename}")


if __name__ == "__main__":
    main()
