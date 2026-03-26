"""Publish the canonical catalog to the frontend public directory."""

from scripts.catalog.paths import CATALOG_FILE, PUBLIC_CATALOG_FILE
from scripts.catalog.publish import publish_canonical_catalog


def main() -> None:
    publish_canonical_catalog()
    print(f'[OK] Published {CATALOG_FILE} to {PUBLIC_CATALOG_FILE}')


if __name__ == '__main__':
    main()
