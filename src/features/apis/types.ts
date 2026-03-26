export type ApiStatus = 'online' | 'offline' | 'unknown'
export type AuthType = 'none' | 'apiKey' | 'OAuth' | 'unknown'
export type AuthFilter = 'all' | 'none' | 'required'
export type CorsFilter = 'all' | 'yes' | 'no'

export interface ApiEntry {
  id: string
  name: string
  description: string
  category: string
  url: string
  auth_type: AuthType
  https: boolean
  cors: boolean
  source_ref: string
  last_verified_at: string | null
  status: ApiStatus
  fail_count?: number
}

export interface ApiCatalogMetadata {
  total: number
  last_synced: string | null
  sources: string[]
}

export interface ApiCatalog {
  metadata: ApiCatalogMetadata
  apis: ApiEntry[]
}

export interface ApiFilters {
  search: string
  category: string
  auth: AuthFilter
  cors: CorsFilter
  showOffline: boolean
}

export interface CatalogStats {
  total: number
  online: number
  pct: number
  lastSynced: string | null
}

export interface CatalogRepository {
  loadCatalog(): Promise<ApiCatalog>
  reportDeadLink(apiId: string): Promise<void>
}
