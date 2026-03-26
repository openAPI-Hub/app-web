"""Fetch, normalize and publish the OpenAPI Hub catalog."""

from datetime import datetime, timezone

import requests

from scripts.catalog.io import write_json
from scripts.catalog.paths import RAW_APIS_GURU_FILE, RAW_PUBLIC_APIS_FILE
from scripts.catalog.pipeline import (
    APIS_GURU_URL,
    PUBLIC_APIS_FALLBACK_URL,
    PUBLIC_APIS_URL,
    build_catalog,
    merge_and_dedupe,
    normalize_apis_guru_catalog,
    normalize_public_apis_entries,
)
from scripts.catalog.publish import publish_catalog, write_canonical_catalog


def fetch_public_apis_entries() -> list[dict]:
    print(f'[+] Fetching public-apis from {PUBLIC_APIS_URL}')

    try:
        response = requests.get(PUBLIC_APIS_URL, timeout=30)
        response.raise_for_status()
        payload = response.json().get('entries', [])
    except Exception:
        print(f'[!] Primary source failed, trying fallback: {PUBLIC_APIS_FALLBACK_URL}')
        response = requests.get(PUBLIC_APIS_FALLBACK_URL, timeout=30)
        response.raise_for_status()
        payload = response.json()

    write_json(RAW_PUBLIC_APIS_FILE, payload)
    return payload


def fetch_apis_guru_directory() -> dict:
    print(f'[+] Fetching APIs.guru from {APIS_GURU_URL}')

    response = requests.get(APIS_GURU_URL, timeout=30)
    response.raise_for_status()
    payload = response.json()
    write_json(RAW_APIS_GURU_FILE, payload)
    return payload


def main() -> None:
    now = datetime.now(timezone.utc).isoformat()
    all_apis: list[dict] = []

    try:
        public_entries = fetch_public_apis_entries()
        public_apis = normalize_public_apis_entries(public_entries)
        print(f'    Found {len(public_apis)} APIs from public-apis')
        all_apis.extend(public_apis)
    except Exception as error:
        print(f'[ERROR] public-apis failed: {error}')

    try:
        guru_catalog = fetch_apis_guru_directory()
        guru_apis = normalize_apis_guru_catalog(guru_catalog)
        print(f'    Found {len(guru_apis)} APIs from APIs.guru')
        all_apis.extend(guru_apis)
    except Exception as error:
        print(f'[ERROR] APIs.guru failed: {error}')

    merged_apis = merge_and_dedupe(all_apis)
    catalog = build_catalog(merged_apis, now)

    write_canonical_catalog(catalog)
    publish_catalog(catalog)

    print(f"\n[OK] {len(merged_apis)} APIs saved to data/catalog/apis.json")
    print('[OK] Published catalog to public/data/apis.json')


if __name__ == '__main__':
    main()
