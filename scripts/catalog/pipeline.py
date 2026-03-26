import hashlib
from typing import Any


PUBLIC_APIS_URL = 'https://api.publicapis.org/entries'
PUBLIC_APIS_FALLBACK_URL = 'https://raw.githubusercontent.com/marcelscruz/public-apis/main/db/entries.json'
PUBLIC_APIS_SOURCE = 'https://github.com/public-apis/public-apis'
APIS_GURU_URL = 'https://api.apis.guru/v2/list.json'
APIS_GURU_SOURCE = 'https://apis.guru'

CATEGORY_MAP = {
    'Weather': 'Weather',
    'Development': 'Development',
    'Finance': 'Finance',
    'Games & Comics': 'Games',
    'Science & Math': 'Science',
    'Geocoding': 'Geo',
    'Animals': 'Animals',
    'Machine Learning': 'AI',
    'Music': 'Music',
    'Books': 'Books',
    'Food & Drink': 'Food',
    'Health': 'Health',
    'Sports & Fitness': 'Sports',
    'Photography': 'Photography',
    'Social': 'Social',
    'Transportation': 'Transport',
    'Video': 'Video',
    'News': 'News',
}


def make_id(name: str, source: str) -> str:
    digest = hashlib.md5(f'{source}:{name}'.encode('utf-8')).hexdigest()[:8]
    prefix = 'pa' if 'github' in source else 'ag'
    return f'{prefix}-{digest}'


def normalize_category(category: str | None) -> str:
    return CATEGORY_MAP.get(category or '', category or 'Other')


def normalize_auth(auth: str | None) -> str:
    if not auth or auth == '' or auth.lower() == 'no':
        return 'none'
    if auth.lower() in ('apikey', 'api_key'):
        return 'apiKey'
    if auth.lower() == 'oauth':
        return 'OAuth'
    return 'unknown'


def normalize_cors(cors: Any) -> bool:
    if isinstance(cors, bool):
        return cors
    if isinstance(cors, str):
        return cors.lower() == 'yes'
    return False


def normalize_public_apis_entries(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    apis: list[dict[str, Any]] = []

    for entry in entries:
        name = entry.get('API') or entry.get('name', '')

        if not name:
            continue

        apis.append(
            {
                'id': make_id(name, PUBLIC_APIS_SOURCE),
                'name': name,
                'description': entry.get('Description') or entry.get('description', ''),
                'category': normalize_category(entry.get('Category') or entry.get('category', '')),
                'url': entry.get('Link') or entry.get('url', ''),
                'auth_type': normalize_auth(entry.get('Auth') or entry.get('auth', '')),
                'https': entry.get('HTTPS', True) if isinstance(entry.get('HTTPS'), bool) else True,
                'cors': normalize_cors(entry.get('Cors') or entry.get('cors', '')),
                'source_ref': PUBLIC_APIS_SOURCE,
                'last_verified_at': None,
                'status': 'unknown',
            }
        )

    return apis


def normalize_apis_guru_catalog(catalog: dict[str, Any]) -> list[dict[str, Any]]:
    apis: list[dict[str, Any]] = []

    for key, data in catalog.items():
        preferred = data.get('preferred', '')
        version = data.get('versions', {}).get(preferred, {})
        info = version.get('info', {})
        name = info.get('title', key)
        description = (info.get('description') or '')[:200]
        origin = info.get('x-origin', [{}])

        url = ''
        if isinstance(origin, list) and origin:
            url = origin[0].get('url', '')
        if not url:
            url = version.get('swaggerUrl', '')

        apis.append(
            {
                'id': make_id(name, APIS_GURU_SOURCE),
                'name': name,
                'description': description,
                'category': 'Development',
                'url': url,
                'auth_type': 'unknown',
                'https': True,
                'cors': False,
                'source_ref': APIS_GURU_SOURCE,
                'last_verified_at': None,
                'status': 'unknown',
            }
        )

    return apis


def merge_and_dedupe(apis: list[dict[str, Any]]) -> list[dict[str, Any]]:
    deduped: dict[str, dict[str, Any]] = {}

    for api in apis:
        key = api['name'].strip().lower()
        if key not in deduped:
            deduped[key] = api

    return list(deduped.values())


def build_catalog(apis: list[dict[str, Any]], now_iso: str) -> dict[str, Any]:
    for api in apis:
        if not api.get('last_verified_at'):
            api['last_verified_at'] = now_iso

    return {
        'metadata': {
            'total': len(apis),
            'last_synced': now_iso,
            'sources': ['public-apis/public-apis', 'apis.guru'],
        },
        'apis': apis,
    }
