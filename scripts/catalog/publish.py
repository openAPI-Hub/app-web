from .io import read_json, write_json
from .paths import CATALOG_FILE, PUBLIC_CATALOG_FILE


def write_canonical_catalog(catalog: dict) -> None:
    write_json(CATALOG_FILE, catalog)


def publish_catalog(catalog: dict) -> None:
    write_json(PUBLIC_CATALOG_FILE, catalog)


def publish_canonical_catalog() -> dict:
    catalog = read_json(CATALOG_FILE)
    publish_catalog(catalog)
    return catalog
