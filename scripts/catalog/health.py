from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any

MAX_WORKERS = 20
TIMEOUT = 10
FAIL_THRESHOLD = 3


def ping(api: dict[str, Any], timeout: int = TIMEOUT) -> tuple[str, bool]:
    import requests

    url = api.get('url', '')

    if not url:
        return api['id'], False

    try:
        response = requests.head(url, timeout=timeout, allow_redirects=True)
        ok = response.status_code < 400
    except Exception:
        try:
            response = requests.get(url, timeout=timeout, allow_redirects=True, stream=True)
            ok = response.status_code < 400
        except Exception:
            ok = False

    return api['id'], ok


def collect_health_results(apis: list[dict[str, Any]], max_workers: int = MAX_WORKERS) -> dict[str, bool]:
    results: dict[str, bool] = {}

    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(ping, api): api for api in apis}
        for future in as_completed(futures):
            api_id, ok = future.result()
            results[api_id] = ok

    return results


def apply_health_results(
    catalog: dict[str, Any],
    results: dict[str, bool],
    now_iso: str,
    fail_threshold: int = FAIL_THRESHOLD,
) -> dict[str, int]:
    online = 0
    failing = 0

    for api in catalog.get('apis', []):
        is_ok = results.get(api['id'], False)

        if is_ok:
            api['status'] = 'online'
            api['last_verified_at'] = now_iso
            api['fail_count'] = 0
            online += 1
            continue

        next_fail_count = int(api.get('fail_count', 0)) + 1
        api['fail_count'] = next_fail_count
        if next_fail_count >= fail_threshold:
            api['status'] = 'offline'
        failing += 1

    metadata = catalog.setdefault('metadata', {})
    metadata['last_synced'] = now_iso

    return {'online': online, 'failing': failing}
