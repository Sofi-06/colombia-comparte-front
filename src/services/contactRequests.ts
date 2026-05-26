import { getStoredAuthUser, isSuperadmin } from './auth'

const CONTACT_REQUESTS_API_URL = 'https://colombia-comparte-back-ssi8.onrender.com/api/contact-requests'

export type ContactRequestStatus =
  | 'pendiente'
  | 'en_proceso'
  | 'gestionada'
  | 'cerrada'

export type ContactRequestRecord = {
  id?: number | string
  pais_id?: number | string | null
  nombre?: string
  correo?: string
  telefono?: string
  finalidad?: string
  mensaje?: string | null
  estado?: ContactRequestStatus
  observaciones_admin?: string | null
  fecha_gestion?: string | null
  gestionado_por?: number | string | null
  created_at?: string
  updated_at?: string
  paises?: {
    id?: number | string
    nombre?: string
    codigo?: string
    slug?: string
  } | null
  usuarios?: {
    id?: number | string
    nombre?: string
    apellido?: string
    email?: string
  } | null
}

export type ContactRequestPayload = {
  pais_id: number
  nombre: string
  correo: string
  telefono: string
  finalidad: string
  mensaje?: string
}

export type ContactRequestUpdatePayload = Partial<ContactRequestPayload> & {
  estado?: ContactRequestStatus
  observaciones_admin?: string
}

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  auth?: boolean
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

async function request<T>(path = '', options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetch(`${CONTACT_REQUESTS_API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers:
      options.auth === false
        ? {
            'Content-Type': 'application/json',
          }
        : getAuthHeaders(),
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload?.message ?? payload?.error ?? 'No fue posible completar la solicitud.'

    throw new Error(message)
  }

  return payload as T
}

function normalizeRequest(record: ContactRequestRecord): ContactRequestRecord {
  return {
    ...record,
    estado: (record.estado ?? 'pendiente') as ContactRequestStatus,
  }
}

function normalizeCollection(payload: unknown) {
  if (Array.isArray(payload)) {
    return (payload as ContactRequestRecord[]).map(normalizeRequest)
  }

  if (payload && typeof payload === 'object') {
    const candidateCollections = [
      (payload as { requests?: unknown }).requests,
      (payload as { solicitudes?: unknown }).solicitudes,
      (payload as { data?: unknown }).data,
    ]

    const collection = candidateCollections.find(Array.isArray)

    if (collection) {
      return (collection as ContactRequestRecord[]).map(normalizeRequest)
    }
  }

  return []
}

function normalizeSingle(payload: unknown) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const candidate =
      (payload as { request?: unknown }).request ??
      (payload as { solicitud?: unknown }).solicitud ??
      (payload as { data?: unknown }).data ??
      payload

    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return normalizeRequest(candidate as ContactRequestRecord)
    }
  }

  return null
}

function sortNewestFirst(records: ContactRequestRecord[]) {
  return [...records].sort((left, right) => {
    const leftTime = new Date(left.created_at ?? left.updated_at ?? 0).getTime()
    const rightTime = new Date(right.created_at ?? right.updated_at ?? 0).getTime()
    return rightTime - leftTime
  })
}

export function getContactRequestCountryLabel(record: ContactRequestRecord) {
  return record.paises?.nombre ?? 'Sin pais'
}

export function getContactRequestManagerLabel(record: ContactRequestRecord) {
  if (!record.usuarios) {
    return 'Sin gestionar'
  }

  return [record.usuarios.nombre, record.usuarios.apellido].filter(Boolean).join(' ')
}

export async function getContactRequests() {
  const payload = await request<unknown>()
  const records = normalizeCollection(payload)
  const authUser = getStoredAuthUser()

  if (isSuperadmin(authUser)) {
    return sortNewestFirst(records)
  }

  const currentCountryId = authUser?.pais_id != null ? String(authUser.pais_id) : null

  return sortNewestFirst(
    records.filter((record) =>
      currentCountryId ? String(record.pais_id ?? record.paises?.id ?? '') === currentCountryId : true,
    ),
  )
}

export async function getContactRequestById(id: number | string) {
  const payload = await request<unknown>(`/${id}`)
  return normalizeSingle(payload)
}

export async function createContactRequest(payload: ContactRequestPayload) {
  const response = await request<unknown>('/public', {
    method: 'POST',
    body: payload,
    auth: false,
  })

  return normalizeSingle(response)
}

export async function updateContactRequest(
  id: number | string,
  payload: ContactRequestUpdatePayload,
) {
  const response = await request<unknown>(`/${id}`, {
    method: 'PUT',
    body: payload,
  })

  return normalizeSingle(response)
}

export async function updateContactRequestStatus(
  id: number | string,
  estado: ContactRequestStatus,
  observaciones_admin?: string,
) {
  const response = await request<unknown>(`/${id}/status`, {
    method: 'PUT',
    body: { estado, observaciones_admin },
  })

  return normalizeSingle(response)
}

export async function deleteContactRequest(id: number | string) {
  return request<{ message?: string }>(`/${id}`, {
    method: 'DELETE',
  })
}
