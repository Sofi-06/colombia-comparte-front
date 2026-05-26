const API_BASE = 'https://colombia-comparte-back-ssi8.onrender.com/api/metrics'

function getAuthHeaders() {
  const token = globalThis.localStorage.getItem('authToken')

  if (!token) throw new Error('Tu sesión no es válida. Inicia sesión nuevamente.')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export type MetricsRecord = {
  users: number
  news: number
  news_published: number
  testimonials: number
  testimonials_published: number
  requests: number
  requests_pending: number
}

export async function getMetrics(): Promise<MetricsRecord> {
  const response = await fetch(API_BASE, { headers: getAuthHeaders() })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.message ?? 'No fue posible obtener métricas.'
    throw new Error(message)
  }

  return (payload?.data ?? {}) as MetricsRecord
}
