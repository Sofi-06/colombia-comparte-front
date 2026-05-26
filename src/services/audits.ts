const AUDITS_API_URL = 'https://colombia-comparte-back-ssi8.onrender.com/api/audits'

type AuditRecord = {
  id?: number | string
  action?: string
  module?: string
  description?: string
  created_at?: string
  ip?: string
  usuario_id?: number | string
  usuarios?: { id?: number | string; nombre?: string; apellido?: string; email?: string } | null
}

type AuditListResponse = {
  audits: AuditRecord[]
  total: number
  limit: number
  offset: number
}

export async function getAudits(limit = 25, offset = 0): Promise<AuditListResponse> {
  const token = globalThis.localStorage.getItem('authToken')

  const res = await fetch(`${AUDITS_API_URL}?limit=${limit}&offset=${offset}`, {
    headers: token
      ? {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => null)
    throw new Error(payload?.message ?? 'No fue posible obtener la bitácora de auditoría.')
  }

  const payload = await res.json()

  return {
    audits: (payload?.audits ?? []) as AuditRecord[],
    total: Number(payload?.total ?? 0),
    limit: Number(payload?.limit ?? limit),
    offset: Number(payload?.offset ?? offset),
  }
}

export type { AuditRecord }
