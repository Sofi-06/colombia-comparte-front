import { getStoredAuthUser, isSuperadmin } from './auth'

const ADMIN_NEWS_API_URL = 'https://colombia-comparte-back-ssi8.onrender.com/api/news'
const PUBLIC_NEWS_API_URL = 'https://colombia-comparte-back-ssi8.onrender.com/api/news/public'

export type NewsRecord = {
  id?: number | string
  titulo?: string
  resumen?: string
  contenido?: string
  imagen_principal_url?: string
  estado?: string
  pais_id?: number | string | null
  paisId?: number | string | null
  pais_nombre?: string
  nombre_pais?: string
  nombrePais?: string
  fecha_publicacion?: string
  slug?: string
  created_at?: string
  updated_at?: string
  title?: string
  summary?: string
  content?: string
  image_url?: string
  imageUrl?: string
  status?: string
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

export type NewsPayload = {
  titulo: string
  resumen: string
  contenido: string
  imagen_principal_url: string
  estado: 'borrador' | 'publicado' | 'despublicado'
  pais_id: number
}

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: NewsPayload | Pick<NewsPayload, 'estado'>
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

function normalizeNewsRecord(news: NewsRecord): NewsRecord {
  const nestedCountry =
    (news.paises && typeof news.paises === 'object' ? news.paises : null) ??
    (news.pais && typeof news.pais === 'object' ? news.pais : null) ??
    (news.country && typeof news.country === 'object' ? news.country : null)
  const normalizedCountryName =
    news.pais_nombre ??
    news.nombre_pais ??
    news.nombrePais ??
    news.country_name ??
    news.countryName ??
    (typeof news.pais === 'string' ? news.pais : undefined) ??
    (typeof news.country === 'string' ? news.country : undefined) ??
    nestedCountry?.nombre ??
    nestedCountry?.name ??
    undefined

  return {
    ...news,
    titulo: news.titulo ?? news.title ?? '',
    resumen: news.resumen ?? news.summary ?? '',
    contenido: news.contenido ?? news.content ?? '',
    imagen_principal_url:
      news.imagen_principal_url ?? news.image_url ?? news.imageUrl ?? '',
    estado: news.estado ?? news.status ?? 'borrador',
    fecha_publicacion:
      news.fecha_publicacion ?? news.publication_date ?? news.published_at ?? undefined,
    pais_id:
      news.pais_id ??
      news.paisId ??
      news.country_id ??
      news.countryId ??
      nestedCountry?.id ??
      null,
    pais:
      nestedCountry ??
      (normalizedCountryName
        ? {
            id:
              news.pais_id ??
              news.paisId ??
              news.country_id ??
              news.countryId ??
              undefined,
            nombre: normalizedCountryName,
          }
        : null),
  }
}

export function getNewsCountryLabel(news: NewsRecord) {
  return (
    (typeof news.pais === 'string' ? news.pais : news.pais?.nombre ?? news.pais?.name) ??
    (typeof news.country === 'string'
      ? news.country
      : news.country?.nombre ?? news.country?.name) ??
    news.pais_nombre ??
    news.nombre_pais ??
    news.nombrePais ??
    news.country_name ??
    news.countryName ??
    'Sin pais'
  )
}

export function getNewsPublicationDate(news: NewsRecord) {
  return news.fecha_publicacion ?? news.created_at ?? news.updated_at ?? ''
}

function normalizeNewsCollection(payload: unknown) {
  if (Array.isArray(payload)) {
    return (payload as NewsRecord[]).map(normalizeNewsRecord)
  }

  if (payload && typeof payload === 'object') {
    const candidateCollections = [
      (payload as { news?: unknown }).news,
      (payload as { noticias?: unknown }).noticias,
      (payload as { data?: unknown }).data,
    ]

    const collection = candidateCollections.find(Array.isArray)

    if (collection) {
      return (collection as NewsRecord[]).map(normalizeNewsRecord)
    }
  }

  return []
}

function normalizeSingleNews(payload: unknown) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const candidate =
      (payload as { news?: unknown }).news ??
      (payload as { noticia?: unknown }).noticia ??
      (payload as { data?: unknown }).data ??
      payload

    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return normalizeNewsRecord(candidate as NewsRecord)
    }
  }

  return null
}

function sortNewestFirst(records: NewsRecord[]) {
  return [...records].sort((left, right) => {
    const leftTime = new Date(left.created_at ?? left.updated_at ?? 0).getTime()
    const rightTime = new Date(right.created_at ?? right.updated_at ?? 0).getTime()
    return rightTime - leftTime
  })
}

export async function getNews() {
  const payload = await request<unknown>(ADMIN_NEWS_API_URL)
  const records = normalizeNewsCollection(payload)
  const authUser = getStoredAuthUser()

  if (isSuperadmin(authUser)) {
    return sortNewestFirst(records)
  }

  const currentCountryId =
    authUser?.pais_id != null ? String(authUser.pais_id) : null

  return sortNewestFirst(
    records.filter((record) =>
      currentCountryId ? String(record.pais_id ?? '') === currentCountryId : true,
    ),
  )
}

export async function getNewsById(id: number | string) {
  const payload = await request<unknown>(ADMIN_NEWS_API_URL, `/${id}`)
  return normalizeSingleNews(payload)
}

export async function createNews(news: NewsPayload) {
  const payload = await request<unknown>(ADMIN_NEWS_API_URL, '', {
    method: 'POST',
    body: news,
  })

  return normalizeSingleNews(payload)
}

export async function updateNews(id: number | string, news: NewsPayload) {
  const payload = await request<unknown>(ADMIN_NEWS_API_URL, `/${id}`, {
    method: 'PUT',
    body: news,
  })

  return normalizeSingleNews(payload)
}

export async function updateNewsStatus(
  id: number | string,
  estado: NewsPayload['estado'],
) {
  const payload = await request<unknown>(ADMIN_NEWS_API_URL, `/${id}/estado`, {
    method: 'PATCH',
    body: { estado },
  })

  return normalizeSingleNews(payload)
}

export async function deleteNews(id: number | string) {
  return request<unknown>(ADMIN_NEWS_API_URL, `/${id}`, {
    method: 'DELETE',
  })
}

export async function getPublicNews(countrySlug: string) {
  const payload = await request<unknown>(PUBLIC_NEWS_API_URL, `/${countrySlug}`, {
    auth: false,
  })

  return sortNewestFirst(normalizeNewsCollection(payload))
}
