const API_BASE_URL = 'http://localhost:3001/api/users'

export type UserRecord = {
  id?: number | string
  nombre?: string
  apellido?: string
  email?: string
  username?: string
  rol?: string
  rol_id?: number | string | null
  pais?: string
  pais_id?: number | string | null
  roles?: {
    id?: number | string
    nombre?: string
  } | null
  paises?: {
    id?: number | string
    nombre?: string
    codigo?: string
    slug?: string
  } | null
}

export type UserPayload = {
  nombre: string
  apellido: string
  email: string
  username: string
  password?: string
  rol_id: number
  pais_id?: number | null
}

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: UserPayload
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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: getAuthHeaders(),
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

function normalizeUsersResponse(payload: unknown): UserRecord[] {
  const normalizeUser = (user: UserRecord) => {
    const nestedRole = user.roles ?? null
    const nestedCountry = user.paises ?? null

    return {
      ...user,
      rol: user.rol ?? nestedRole?.nombre ?? '',
      rol_id: user.rol_id ?? nestedRole?.id ?? null,
      pais: user.pais ?? nestedCountry?.nombre ?? '',
      pais_id: user.pais_id ?? nestedCountry?.id ?? null,
    }
  }

  if (Array.isArray(payload)) {
    return (payload as UserRecord[]).map(normalizeUser)
  }

  if (payload && typeof payload === 'object') {
    const candidateCollections = [
      (payload as { users?: unknown }).users,
      (payload as { data?: unknown }).data,
      (payload as { usuarios?: unknown }).usuarios,
    ]

    const collection = candidateCollections.find(Array.isArray)

    if (collection) {
      return (collection as UserRecord[]).map(normalizeUser)
    }
  }

  return []
}

export async function getUsers() {
  const payload = await request<unknown>()
  return normalizeUsersResponse(payload)
}

export async function createUser(user: UserPayload) {
  return request<UserRecord>('', {
    method: 'POST',
    body: user,
  })
}

export async function updateUser(id: number | string, user: UserPayload) {
  return request<UserRecord>(`/${id}`, {
    method: 'PATCH',
    body: user,
  })
}

export async function deleteUser(id: number | string) {
  return request<unknown>(`/${id}`, {
    method: 'DELETE',
  })
}
