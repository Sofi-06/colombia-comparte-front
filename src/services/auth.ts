export type AuthUser = {
  id?: number | string
  nombre?: string
  apellido?: string
  email?: string
  username?: string
  rol?: string
  role?: string
  rol_id?: number | string | null
  role_id?: number | string | null
  pais?: string
  country?: string | {
    id?: number | string
    nombre?: string
    name?: string
    slug?: string
  } | null
  pais_slug?: string
  country_slug?: string
  pais_id?: number | string | null
  country_id?: number | string | null
  roles?: {
    id?: number | string
    nombre?: string
  } | null
  paises?: {
    id?: number | string
    nombre?: string
    name?: string
    slug?: string
  } | null
}

const DASHBOARD_COUNTRY_STORAGE_KEY = 'dashboardCountry'

function toRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function toStringValue(value: unknown) {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

function toIdValue(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  return null
}

export function normalizeAuthUser(user: unknown): AuthUser | null {
  const typedUser = toRecord(user)

  if (!typedUser) {
    return null
  }

  const nestedRole =
    toRecord(typedUser.roles) ??
    toRecord(typedUser.rol) ??
    toRecord(typedUser.role)

  const nestedCountry =
    toRecord(typedUser.paises) ??
    toRecord(typedUser.pais) ??
    toRecord(typedUser.country)

  const normalizedUser: AuthUser = {
    ...typedUser,
    rol:
      toStringValue(typedUser.rol) ||
      toStringValue(typedUser.role) ||
      toStringValue(nestedRole?.nombre) ||
      toStringValue(nestedRole?.name),
    rol_id:
      toIdValue(typedUser.rol_id) ??
      toIdValue(typedUser.role_id) ??
      toIdValue(nestedRole?.id),
    pais:
      toStringValue(typedUser.pais) ||
      toStringValue(typedUser.country) ||
      toStringValue(typedUser.nombre_pais) ||
      toStringValue(typedUser.country_name) ||
      toStringValue(nestedCountry?.nombre) ||
      toStringValue(nestedCountry?.name),
    pais_slug:
      toStringValue(typedUser.pais_slug) ||
      toStringValue(typedUser.country_slug) ||
      toStringValue(nestedCountry?.slug),
    pais_id:
      toIdValue(typedUser.pais_id) ??
      toIdValue(typedUser.country_id) ??
      toIdValue(nestedCountry?.id),
    roles: nestedRole
      ? {
          id: toIdValue(nestedRole.id) ?? undefined,
          nombre: toStringValue(nestedRole.nombre) || toStringValue(nestedRole.name) || undefined,
        }
      : null,
    paises: nestedCountry
      ? {
          id: toIdValue(nestedCountry.id) ?? undefined,
          nombre:
            toStringValue(nestedCountry.nombre) || toStringValue(nestedCountry.name) || undefined,
          name:
            toStringValue(nestedCountry.name) || toStringValue(nestedCountry.nombre) || undefined,
          slug: toStringValue(nestedCountry.slug) || undefined,
        }
      : null,
  }

  return normalizedUser
}

export function getStoredAuthUser(): AuthUser | null {
  const rawUser = globalThis.localStorage.getItem('authUser')

  if (!rawUser) {
    return null
  }

  try {
    return normalizeAuthUser(JSON.parse(rawUser))
  } catch {
    return null
  }
}

export function getStoredDashboardCountry() {
  return globalThis.localStorage.getItem(DASHBOARD_COUNTRY_STORAGE_KEY)
}

export function setStoredDashboardCountry(country: string) {
  globalThis.localStorage.setItem(DASHBOARD_COUNTRY_STORAGE_KEY, country)
}

export function clearStoredDashboardCountry() {
  globalThis.localStorage.removeItem(DASHBOARD_COUNTRY_STORAGE_KEY)
}

export function getNormalizedRole(user: AuthUser | null) {
  return (user?.rol ?? '').trim().toLowerCase()
}

export function isSuperadmin(user: AuthUser | null) {
  return getNormalizedRole(user) === 'superadmin'
}
