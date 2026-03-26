import unittest

from scripts.catalog.health import apply_health_results


class HealthRulesTests(unittest.TestCase):
    def setUp(self) -> None:
        self.catalog = {
            'metadata': {
                'total': 2,
                'last_synced': '2026-03-25T10:00:00Z',
                'sources': ['public-apis/public-apis'],
            },
            'apis': [
                {
                    'id': 'ok-1',
                    'name': 'Healthy API',
                    'status': 'unknown',
                    'fail_count': 2,
                    'last_verified_at': '2026-03-20T10:00:00Z',
                },
                {
                    'id': 'fail-1',
                    'name': 'Failing API',
                    'status': 'online',
                    'fail_count': 2,
                    'last_verified_at': '2026-03-20T10:00:00Z',
                },
            ],
        }

    def test_success_resets_fail_count_and_marks_api_online(self) -> None:
        summary = apply_health_results(
            self.catalog,
            {'ok-1': True, 'fail-1': False},
            '2026-03-26T10:00:00Z',
        )

        self.assertEqual(summary['online'], 1)
        self.assertEqual(self.catalog['apis'][0]['status'], 'online')
        self.assertEqual(self.catalog['apis'][0]['fail_count'], 0)

    def test_failure_marks_api_offline_after_threshold(self) -> None:
        apply_health_results(
            self.catalog,
            {'ok-1': True, 'fail-1': False},
            '2026-03-26T10:00:00Z',
        )

        self.assertEqual(self.catalog['apis'][1]['status'], 'offline')
        self.assertEqual(self.catalog['apis'][1]['fail_count'], 3)
        self.assertEqual(self.catalog['metadata']['last_synced'], '2026-03-26T10:00:00Z')


if __name__ == '__main__':
    unittest.main()
