import unittest

from scripts.catalog.pipeline import (
    build_catalog,
    merge_and_dedupe,
    normalize_auth,
    normalize_cors,
    normalize_public_apis_entries,
)


class CatalogPipelineTests(unittest.TestCase):
    def test_normalize_auth_handles_known_values(self) -> None:
        self.assertEqual(normalize_auth(''), 'none')
        self.assertEqual(normalize_auth('apiKey'), 'apiKey')
        self.assertEqual(normalize_auth('OAuth'), 'OAuth')
        self.assertEqual(normalize_auth('custom'), 'unknown')

    def test_normalize_cors_handles_text_and_boolean_values(self) -> None:
        self.assertTrue(normalize_cors(True))
        self.assertTrue(normalize_cors('yes'))
        self.assertFalse(normalize_cors('no'))

    def test_merge_and_dedupe_keeps_first_name_case_insensitive(self) -> None:
        apis = [
            {'id': '1', 'name': 'PokeAPI'},
            {'id': '2', 'name': 'pokeapi'},
            {'id': '3', 'name': 'NASA'},
        ]

        merged = merge_and_dedupe(apis)

        self.assertEqual(len(merged), 2)
        self.assertEqual(merged[0]['id'], '1')

    def test_build_catalog_sets_missing_verification_dates(self) -> None:
        apis = [{'id': '1', 'name': 'NASA', 'last_verified_at': None}]

        catalog = build_catalog(apis, '2026-03-26T10:00:00Z')

        self.assertEqual(catalog['metadata']['total'], 1)
        self.assertEqual(catalog['apis'][0]['last_verified_at'], '2026-03-26T10:00:00Z')

    def test_public_entries_are_normalized_to_catalog_shape(self) -> None:
        entries = [
            {
                'API': 'JSONPlaceholder',
                'Description': 'Fake REST API',
                'Category': 'Development',
                'Link': 'https://jsonplaceholder.typicode.com',
                'Auth': '',
                'HTTPS': True,
                'Cors': 'yes',
            }
        ]

        normalized = normalize_public_apis_entries(entries)

        self.assertEqual(normalized[0]['name'], 'JSONPlaceholder')
        self.assertEqual(normalized[0]['auth_type'], 'none')
        self.assertTrue(normalized[0]['cors'])
        self.assertEqual(normalized[0]['status'], 'unknown')


if __name__ == '__main__':
    unittest.main()
