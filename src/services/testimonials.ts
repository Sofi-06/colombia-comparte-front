import { getStoredAuthUser, isSuperadmin } from './auth'

const ADMIN_TESTIMONIALS_API_URL = 'https://colombia-comparte-back-ssi8.onrender.com/api/testimonials'
const PUBLIC_TESTIMONIALS_API_URL = 'https://colombia-comparte-back-ssi8.onrender.com/api/testimonials/public'

export type TestimonialRecord = {
  id?: number | string
  nombre?: string
  cargo?: string
  empresa?: string
  contenido?: string
  foto_url?: string
  video_url?: string
  instagram_url?: string
  facebook_url?: string
  estado?: string
  destacado?: boolean
  pais_id?: number | string | null
  paisId?: number | string | null
  pais_nombre?: string
  nombre_pais?: string
  nombrePais?: string
  fecha_publicacion?: string
  slug?: string
  created_at?: string
  updated_at?: string
  name?: string
  role?: string
  company?: string
  content?: string
  photo_url?: string
  instagram?: string
  facebook?: string
  status?: string
  featured?: boolean
  country_id?: number | string | null
  countryId?: number | string | null
  country_name?: string
  countryName?: string
  publication_date?: string
  published_at?: string
  pais?: string | {
    id?: number | string
    nombre?: string
    name?: string
    slug?: string
  } | null
  paises?: {
    id?: number | string
    nombre?: string
    name?: string
    slug?: string
  } | null
  country?: string | {
    id?: number | string
    nombre?: string
    name?: string
    slug?: string
  } | null
}

export type TestimonialPayload = {
  nombre: string
  cargo: string
  empresa: string
  contenido: string
  foto_url: string
  video_url?: string
  instagram_url: string
  facebook_url: string
  estado: 'borrador' | 'publicado' | 'despublicado'
  destacado: boolean
  pais_id: number
}

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: TestimonialPayload | Pick<TestimonialPayload, 'estado'>
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

async function request<T>(baseUrl: string, path = '', options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: options.auth === false ? undefined : getAuthHeaders(),
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

function normalizeTestimonialRecord(testimonial: TestimonialRecord): TestimonialRecord {
  const nestedCountry =
    (testimonial.paises && typeof testimonial.paises === 'object' ? testimonial.paises : null) ??
    (testimonial.pais && typeof testimonial.pais === 'object' ? testimonial.pais : null) ??
    (testimonial.country && typeof testimonial.country === 'object' ? testimonial.country : null)
  const normalizedCountryName =
    testimonial.pais_nombre ??
    testimonial.nombre_pais ??
    testimonial.nombrePais ??
    testimonial.country_name ??
    testimonial.countryName ??
    (typeof testimonial.pais === 'string' ? testimonial.pais : undefined) ??
    (typeof testimonial.country === 'string' ? testimonial.country : undefined) ??
    nestedCountry?.nombre ??
    nestedCountry?.name ??
    undefined

  return {
    ...testimonial,
    nombre: testimonial.nombre ?? testimonial.name ?? '',
    cargo: testimonial.cargo ?? testimonial.role ?? '',
    empresa: testimonial.empresa ?? testimonial.company ?? '',
    contenido: testimonial.contenido ?? testimonial.content ?? '',
    foto_url: testimonial.foto_url ?? testimonial.photo_url ?? '',
    video_url: testimonial.video_url ?? undefined,
    instagram_url: testimonial.instagram_url ?? testimonial.instagram ?? '',
    facebook_url: testimonial.facebook_url ?? testimonial.facebook ?? '',
    estado: testimonial.estado ?? testimonial.status ?? 'borrador',
    destacado: testimonial.destacado ?? testimonial.featured ?? false,
    fecha_publicacion:
      testimonial.fecha_publicacion ??
      testimonial.publication_date ??
      testimonial.published_at ??
      undefined,
    pais_id:
      testimonial.pais_id ??
      testimonial.paisId ??
      testimonial.country_id ??
      testimonial.countryId ??
      nestedCountry?.id ??
      null,
    pais:
      nestedCountry ??
      (normalizedCountryName
        ? {
            id:
              testimonial.pais_id ??
              testimonial.paisId ??
              testimonial.country_id ??
              testimonial.countryId ??
              undefined,
            nombre: normalizedCountryName,
          }
        : null),
  }
}

function normalizeTestimonialsCollection(payload: unknown) {
  if (Array.isArray(payload)) {
    return (payload as TestimonialRecord[]).map(normalizeTestimonialRecord)
  }

  if (payload && typeof payload === 'object') {
    const candidateCollections = [
      (payload as { testimonials?: unknown }).testimonials,
      (payload as { testimonios?: unknown }).testimonios,
      (payload as { data?: unknown }).data,
    ]

    const collection = candidateCollections.find(Array.isArray)

    if (collection) {
      return (collection as TestimonialRecord[]).map(normalizeTestimonialRecord)
    }
  }

  return []
}

function normalizeSingleTestimonial(payload: unknown) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const candidate =
      (payload as { testimonial?: unknown }).testimonial ??
      (payload as { testimonio?: unknown }).testimonio ??
      (payload as { data?: unknown }).data ??
      payload

    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return normalizeTestimonialRecord(candidate as TestimonialRecord)
    }
  }

  return null
}

function sortNewestFirst(records: TestimonialRecord[]) {
  return [...records].sort((left, right) => {
    const leftTime = new Date(
      left.fecha_publicacion ?? left.created_at ?? left.updated_at ?? 0,
    ).getTime()
    const rightTime = new Date(
      right.fecha_publicacion ?? right.created_at ?? right.updated_at ?? 0,
    ).getTime()
    return rightTime - leftTime
  })
}

export function getTestimonialCountryLabel(testimonial: TestimonialRecord) {
  return (
    (typeof testimonial.pais === 'string'
      ? testimonial.pais
      : testimonial.pais?.nombre ?? testimonial.pais?.name) ??
    (typeof testimonial.country === 'string'
      ? testimonial.country
      : testimonial.country?.nombre ?? testimonial.country?.name) ??
    testimonial.pais_nombre ??
    testimonial.nombre_pais ??
    testimonial.nombrePais ??
    testimonial.country_name ??
    testimonial.countryName ??
    'Sin pais'
  )
}

export function getTestimonialPublicationDate(testimonial: TestimonialRecord) {
  return testimonial.fecha_publicacion ?? testimonial.created_at ?? testimonial.updated_at ?? ''
}

export async function getTestimonials() {
  const payload = await request<unknown>(ADMIN_TESTIMONIALS_API_URL)
  const records = normalizeTestimonialsCollection(payload)
  const authUser = getStoredAuthUser()

  if (isSuperadmin(authUser)) {
    return sortNewestFirst(records)
  }

  const currentCountryId = authUser?.pais_id != null ? String(authUser.pais_id) : null

  return sortNewestFirst(
    records.filter((record) =>
      currentCountryId ? String(record.pais_id ?? '') === currentCountryId : true,
    ),
  )
}

export async function getTestimonialById(id: number | string) {
  const payload = await request<unknown>(ADMIN_TESTIMONIALS_API_URL, `/${id}`)
  return normalizeSingleTestimonial(payload)
}

export async function createTestimonial(testimonial: TestimonialPayload) {
  const payload = await request<unknown>(ADMIN_TESTIMONIALS_API_URL, '', {
    method: 'POST',
    body: testimonial,
  })

  return normalizeSingleTestimonial(payload)
}

export async function updateTestimonial(
  id: number | string,
  testimonial: TestimonialPayload,
) {
  const payload = await request<unknown>(ADMIN_TESTIMONIALS_API_URL, `/${id}`, {
    method: 'PUT',
    body: testimonial,
  })

  return normalizeSingleTestimonial(payload)
}

export async function updateTestimonialStatus(
  id: number | string,
  estado: TestimonialPayload['estado'],
) {
  const payload = await request<unknown>(ADMIN_TESTIMONIALS_API_URL, `/${id}/estado`, {
    method: 'PATCH',
    body: { estado },
  })

  return normalizeSingleTestimonial(payload)
}

export async function deleteTestimonial(id: number | string) {
  return request<unknown>(ADMIN_TESTIMONIALS_API_URL, `/${id}`, {
    method: 'DELETE',
  })
}

export async function getPublicTestimonials(countrySlug: string) {
  const payload = await request<unknown>(PUBLIC_TESTIMONIALS_API_URL, `/${countrySlug}`, {
    auth: false,
  })

  return sortNewestFirst(normalizeTestimonialsCollection(payload))
}
