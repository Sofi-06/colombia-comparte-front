const COUNTRIES_API_BASE_URL = 'http://localhost:3001/api/countries'

export type CountryRecord = {
  id: number
  nombre: string
  codigo?: string
  slug?: string
  estado?: string
  created_at?: string
}

function getAuthHeaders() {
  const token = globalThis.localStorage.getItem('authToken')

  if (!token) {
    throw new Error('Tu sesion no es valida. Inicia sesion nuevamente.')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

type CountryRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
}

async function request<T>(path = '/active', options: CountryRequestOptions = {}) {
  const response = await fetch(`${COUNTRIES_API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: getAuthHeaders(),
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload?.message ?? payload?.error ?? 'No fue posible cargar los paises.'

    throw new Error(message)
  }

  return payload as T
}

function normalizeCollection(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload as CountryRecord[]
  }

  if (payload && typeof payload === 'object') {
    const candidate =
      (payload as { countries?: unknown }).countries ??
      (payload as { paises?: unknown }).paises ??
      (payload as { data?: unknown }).data

    if (Array.isArray(candidate)) {
      return candidate as CountryRecord[]
    }
  }

  return []
}

function normalizeSingle(payload: unknown) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const candidate =
      (payload as { country?: unknown }).country ??
      (payload as { pais?: unknown }).pais ??
      (payload as { data?: unknown }).data ??
      payload

    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return candidate as CountryRecord
    }
  }

  return null
}

export async function getActiveCountries() {
  const payload = await request<unknown>('/active')
  return normalizeCollection(payload)
}

export async function getCountries() {
  const payload = await request<unknown>('/')
  return normalizeCollection(payload)
}

export async function getCountryById(id: number | string) {
  const payload = await request<unknown>(`/${id}`)
  return normalizeSingle(payload)
}

export async function createCountry(country: {
  nombre: string
  codigo: string
  slug: string
  estado: string
}) {
  const payload = await request<unknown>('/', {
    method: 'POST',
    body: country,
  })

  return normalizeSingle(payload)
}

export async function updateCountry(
  id: number | string,
  country: Partial<{
    nombre: string
    codigo: string
    slug: string
    estado: string
  }>,
) {
  const payload = await request<unknown>(`/${id}`, {
    method: 'PATCH',
    body: country,
  })

  return normalizeSingle(payload)
}

export async function deleteCountry(id: number | string) {
  return request<{ message?: string }>(`/${id}`, {
    method: 'DELETE',
  })
}
