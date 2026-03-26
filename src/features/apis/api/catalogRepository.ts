import type {
  ApiCatalog,
  ApiCatalogMetadata,
  ApiEntry,
  ApiStatus,
  AuthType,
  CatalogRepository,
} from '../types'

const STATIC_CATALOG_PATH = `${import.meta.env.BASE_URL}data/apis.json`

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid catalog field: ${fieldName}`)
  }

  return value
}

function asOptionalString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  return typeof value === 'string' ? value : null
}

function asBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid catalog field: ${fieldName}`)
  }

  return value
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function asAuthType(value: unknown): AuthType {
  if (value === 'none' || value === 'apiKey' || value === 'OAuth' || value === 'unknown') {
    return value
  }

  return 'unknown'
}

function asStatus(value: unknown): ApiStatus {
  if (value === 'online' || value === 'offline' || value === 'unknown') {
    return value
  }

  return 'unknown'
}

function parseMetadata(value: unknown, totalApis: number): ApiCatalogMetadata {
  if (!isRecord(value)) {
    throw new Error('Invalid catalog metadata')
  }

  const sources = Array.isArray(value.sources)
    ? value.sources.filter((source): source is string => typeof source === 'string')
    : []

  return {
    total: typeof value.total === 'number' ? value.total : totalApis,
    last_synced: asOptionalString(value.last_synced),
    sources,
  }
}

function parseApiEntry(value: unknown): ApiEntry {
  if (!isRecord(value)) {
    throw new Error('Invalid API entry')
  }

  return {
    id: asString(value.id, 'id'),
    name: asString(value.name, 'name'),
    description: asString(value.description, 'description'),
    category: asString(value.category, 'category'),
    url: asString(value.url, 'url'),
    auth_type: asAuthType(value.auth_type),
    https: asBoolean(value.https, 'https'),
    cors: asBoolean(value.cors, 'cors'),
    source_ref: asString(value.source_ref, 'source_ref'),
    last_verified_at: asOptionalString(value.last_verified_at),
    status: asStatus(value.status),
    fail_count: asNumber(value.fail_count),
  }
}

export function parseCatalog(payload: unknown): ApiCatalog {
  if (!isRecord(payload) || !Array.isArray(payload.apis)) {
    throw new Error('Invalid catalog payload')
  }

  const apis = payload.apis.map(parseApiEntry)

  return {
    metadata: parseMetadata(payload.metadata, apis.length),
    apis,
  }
}

export const staticCatalogRepository: CatalogRepository = {
  async loadCatalog() {
    const response = await fetch(STATIC_CATALOG_PATH)

    if (!response.ok) {
      throw new Error(`Unable to load API catalog (${response.status})`)
    }

    return parseCatalog(await response.json())
  },
  async reportDeadLink(_apiId) {
    return Promise.resolve()
  },
}
