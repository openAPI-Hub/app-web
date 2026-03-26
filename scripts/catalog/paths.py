from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / 'data'
RAW_DIR = DATA_DIR / 'raw'
CATALOG_DIR = DATA_DIR / 'catalog'
CATALOG_FILE = CATALOG_DIR / 'apis.json'
PUBLIC_DATA_DIR = ROOT_DIR / 'public' / 'data'
PUBLIC_CATALOG_FILE = PUBLIC_DATA_DIR / 'apis.json'
RAW_PUBLIC_APIS_FILE = RAW_DIR / 'public_apis.json'
RAW_APIS_GURU_FILE = RAW_DIR / 'apis_guru.json'
