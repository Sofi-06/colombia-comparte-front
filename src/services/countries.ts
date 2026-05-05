const COUNTRIES_API_URL = 'http://localhost:3001/api/countries/active'

export type CountryRecord = {
  id: number
  nombre: string
  codigo?: string
  slug?: string
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

export async function getActiveCountries() {
  const response = await fetch(COUNTRIES_API_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload?.message ?? payload?.error ?? 'No fue posible cargar los paises.'

    throw new Error(message)
  }

  return Array.isArray(payload) ? (payload as CountryRecord[]) : []
}
