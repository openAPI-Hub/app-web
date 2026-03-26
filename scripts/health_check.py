"""Run daily health checks against the canonical API catalog."""

from datetime import datetime, timezone

from scripts.catalog.health import apply_health_results, collect_health_results
from scripts.catalog.io import read_json
from scripts.catalog.paths import CATALOG_FILE
from scripts.catalog.publish import publish_catalog, write_canonical_catalog


def main() -> None:
    catalog = read_json(CATALOG_FILE)
    apis = catalog.get('apis', [])
    now = datetime.now(timezone.utc).isoformat()

    print(f'[+] Health check on {len(apis)} APIs...')

    results = collect_health_results(apis)
    summary = apply_health_results(catalog, results, now)

    write_canonical_catalog(catalog)
    publish_catalog(catalog)

    print(f"[OK] Online: {summary['online']} | Offline/Failing: {summary['failing']}")


if __name__ == '__main__':
    main()
