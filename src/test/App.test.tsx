import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import App from '../app/App'
import type { ApiCatalog, CatalogRepository } from '../features/apis/types'
import { sampleCatalog } from './fixtures/catalog'

function createRepository(catalog: ApiCatalog = sampleCatalog) {
  return {
    loadCatalog: vi.fn<() => Promise<ApiCatalog>>().mockResolvedValue(catalog),
    reportDeadLink: vi.fn<(apiId: string) => Promise<void>>().mockResolvedValue(undefined),
  } satisfies CatalogRepository
}

describe('OpenAPI Hub app', () => {
  it('filters the catalog with search, category and auth filters', async () => {
    const repository = createRepository()
    const user = userEvent.setup()

    render(<App catalogRepository={repository} />)

    await screen.findByText('JSONPlaceholder')

    await user.type(screen.getByLabelText(/rechercher une api/i), 'openai')

    await waitFor(() => {
      expect(screen.getByText('OpenAI API')).toBeInTheDocument()
      expect(screen.queryByText('PokeAPI')).not.toBeInTheDocument()
    })

    await user.clear(screen.getByLabelText(/rechercher une api/i))
    await user.click(
      within(screen.getByRole('group', { name: /filtres de categories/i })).getByRole('button', {
        name: 'AI',
      }),
    )
    await user.selectOptions(screen.getByLabelText(/filtre authentification/i), 'required')
    await user.selectOptions(screen.getByLabelText(/filtre cors/i), 'no')

    await waitFor(() => {
      expect(screen.getByText('OpenAI API')).toBeInTheDocument()
      expect(screen.queryByText('JSONPlaceholder')).not.toBeInTheDocument()
      expect(screen.queryByText('ExchangeRate API')).not.toBeInTheDocument()
    })
  })

  it('toggles theme and persists the selected value', async () => {
    const repository = createRepository()
    const user = userEvent.setup()

    render(<App catalogRepository={repository} />)

    await screen.findByText('JSONPlaceholder')

    const toggle = screen.getByRole('button', { name: /passer en mode sombre/i })
    await user.click(toggle)

    expect(document.documentElement).toHaveClass('dark')
    expect(window.localStorage.getItem('openapi-hub-theme')).toBe('dark')
    expect(screen.getByRole('button', { name: /passer en mode clair/i })).toBeInTheDocument()
  })

  it('opens the modal and copies the API url', async () => {
    const repository = createRepository()
    const user = userEvent.setup()
    const writeText = vi.fn<(value: string) => Promise<void>>().mockResolvedValue(undefined)

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText,
      },
    })

    render(<App catalogRepository={repository} />)

    await screen.findByText('PokeAPI')
    await user.click(screen.getByRole('button', { name: /ouvrir les details de pokeapi/i }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /copier l'url/i }))

    expect(writeText).toHaveBeenCalledWith('https://pokeapi.co')
  })

  it('shows offline APIs only when the toggle is enabled', async () => {
    const repository = createRepository()
    const user = userEvent.setup()

    render(<App catalogRepository={repository} />)

    await screen.findByText('JSONPlaceholder')

    expect(screen.queryByText('ExchangeRate API')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /afficher les apis offline/i }))

    expect(await screen.findByText('ExchangeRate API')).toBeInTheDocument()
  })
})
