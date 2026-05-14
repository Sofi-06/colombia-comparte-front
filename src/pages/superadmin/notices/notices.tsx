import { useEffect, useMemo, useState } from 'react'
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
} from 'react-icons/hi2'
import NavbarTwo from '../../../components/navbar2/navbartwo'
import { getStoredAuthUser, isEditor, isSuperadmin } from '../../../services/auth'
import { getActiveCountries, type CountryRecord } from '../../../services/countries'
import {
  deleteNews,
  getNews,
  getNewsPublicationDate,
  type NewsRecord,
} from '../../../services/news'
import './notices.css'

type PaginationItem = number | 'ellipsis'

function getPaginationItems(totalPages: number, currentPage: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ]
}

function getStatusTone(status: string) {
  const normalizedStatus = status.trim().toLowerCase()

  if (
    normalizedStatus === 'borrador' ||
    normalizedStatus === 'publicado' ||
    normalizedStatus === 'despublicado'
  ) {
    return normalizedStatus
  }

  return 'borrador'
}

function getFormattedDate(notice: NewsRecord) {
  const value = getNewsPublicationDate(notice)

  if (!value) {
    return 'Sin fecha'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Sin fecha'
  }

  return parsedDate.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getRawCountryLabel(notice: NewsRecord) {
  const noticeCountry =
    (notice.pais && typeof notice.pais === 'object' ? notice.pais : null) ??
    (notice.paises && typeof notice.paises === 'object' ? notice.paises : null) ??
    (notice.country && typeof notice.country === 'object' ? notice.country : null)

  return (
    (typeof notice.pais === 'string' ? notice.pais : undefined) ??
    (typeof notice.country === 'string' ? notice.country : undefined) ??
    notice.pais_nombre ??
    notice.nombre_pais ??
    notice.nombrePais ??
    notice.country_name ??
    notice.countryName ??
    noticeCountry?.nombre ??
    noticeCountry?.name ??
    ''
  ).trim()
}

function NoticesPage() {
  const authUser = useMemo(getStoredAuthUser, [])
  const canDeleteNews = !isEditor(authUser)
  const [notices, setNotices] = useState<NewsRecord[]>([])
  const [countries, setCountries] = useState<CountryRecord[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')
  const pageSize = 6

  const loadNotices = async () => {
    setIsLoading(true)

    try {
      const [records, countryRecords] = await Promise.all([getNews(), getActiveCountries()])
      setNotices(records)
      setCountries(countryRecords)
      setStatusMessage('')
      setStatusTone('')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible cargar las noticias.',
      )
      setStatusTone('error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadNotices()
  }, [])

  const countryNameById = useMemo(
    () =>
      new Map(countries.map((country) => [String(country.id), country.nombre])),
    [countries],
  )

  const currentUserCountryLabel = useMemo(() => {
    if (authUser?.pais) {
      return authUser.pais
    }

    if (authUser?.paises?.nombre) {
      return authUser.paises.nombre
    }

    if (authUser?.pais_id != null) {
      return countryNameById.get(String(authUser.pais_id)) ?? ''
    }

    return ''
  }, [authUser, countryNameById])

  const getCountryLabel = (notice: NewsRecord) => {
    const normalizedLabel = getRawCountryLabel(notice)

    if (normalizedLabel) {
      return normalizedLabel
    }

    return notice.pais_id != null
      ? countryNameById.get(String(notice.pais_id)) ?? `Pais ${notice.pais_id}`
      : !isSuperadmin(authUser) && currentUserCountryLabel
        ? currentUserCountryLabel
        : 'Sin país'
  }

  const filteredNotices = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase()

    if (!normalizedQuery) {
      return notices
    }

    return notices.filter((notice) => {
      const candidates = [
        notice.titulo ?? '',
        notice.resumen ?? '',
        notice.contenido ?? '',
        notice.estado ?? '',
        getCountryLabel(notice),
      ]

      return candidates.some((candidate) =>
        candidate.toLowerCase().includes(normalizedQuery),
      )
    })
  }, [notices, search, countries, authUser, currentUserCountryLabel])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / pageSize))
  const paginationItems = getPaginationItems(totalPages, currentPage)
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const handleDelete = async (notice: NewsRecord) => {
    if (notice.id == null) {
      return
    }

    const confirmed = globalThis.confirm(
      `Vas a eliminar la noticia "${notice.titulo ?? 'sin titulo'}". Esta accion no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteNews(notice.id)
      setStatusMessage('Noticia eliminada correctamente.')
      setStatusTone('success')
      await loadNotices()
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible eliminar la noticia.',
      )
      setStatusTone('error')
    }
  }

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Gestion de noticias"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="noticias"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="notices-directory">
          <section className="notices-directory__toolbar">
            <div className="notices-directory__heading">
              <h1>Noticias</h1>
              <p>
                {filteredNotices.length} registros
                {filteredNotices.length > pageSize ? ` · Pagina ${currentPage} de ${totalPages}` : ''}
              </p>
            </div>

            <label className="notices-search" aria-label="Buscar noticias">
              <HiOutlineMagnifyingGlass aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por título, resumen, estado o país"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <div className="notices-directory__actions">
              <a
                className="notices-directory__button notices-directory__button--primary"
                href="#/panel/noticias/crear"
              >
                <HiOutlinePlus aria-hidden="true" />
                Crear noticia
              </a>
            </div>
          </section>

          {statusMessage ? (
            <p className={`notices-directory__status notices-directory__status--${statusTone}`}>
              {statusMessage}
            </p>
          ) : null}

          {isLoading ? (
            <section className="notices-directory__empty">
              <h2>Cargando noticias</h2>
              <p>Estamos trayendo las publicaciones disponibles para el panel.</p>
            </section>
          ) : filteredNotices.length === 0 ? (
            <section className="notices-directory__empty">
              <h2>No encontramos noticias con ese filtro</h2>
              <p>Puedes ajustar la busqueda o crear una nueva publicacion.</p>
            </section>
          ) : (
            <section className="notices-table-shell">
              <div className="notices-table">
                <div className="notices-table__head">
                  <span>Título</span>
                  <span>País</span>
                  <span>Estado</span>
                  <span>Fecha</span>
                  <span>Acciones</span>
                </div>

                {paginatedNotices.map((notice, index) => {
                  const status = getStatusTone(notice.estado ?? 'borrador')

                  return (
                    <article className="notices-row" key={notice.id ?? `${notice.titulo}-${index}`}>
                      <div className="notices-row__identity">
                        <strong>{notice.titulo ?? 'Noticia sin titulo'}</strong>
                        <span className="notices-row__excerpt">
                          {notice.resumen ?? 'Sin resumen disponible'}
                        </span>
                      </div>

                      <p className="notices-row__cell">{getCountryLabel(notice)}</p>
                      <div className="notices-row__cell">
                        <span className={`notices-row__badge notices-row__badge--${status}`}>
                          {notice.estado ?? 'borrador'}
                        </span>
                      </div>
                      <p className="notices-row__cell">{getFormattedDate(notice)}</p>

                      <div className="notices-row__actions">
                        <a
                          href={`#/panel/noticias/editar/${notice.id ?? ''}`}
                          aria-label={`Editar ${notice.titulo ?? 'noticia'}`}
                          title="Editar noticia"
                        >
                          <HiOutlinePencilSquare aria-hidden="true" />
                        </a>
                        {canDeleteNews ? (
                          <button
                            type="button"
                            onClick={() => void handleDelete(notice)}
                            aria-label={`Eliminar ${notice.titulo ?? 'noticia'}`}
                            title="Eliminar noticia"
                          >
                            <HiOutlineTrash aria-hidden="true" />
                          </button>
                        ) : null}
                      </div>
                    </article>
                  )
                })}
              </div>

              {totalPages > 1 ? (
                <div className="notices-pagination">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                  >
                    <HiOutlineChevronLeft aria-hidden="true" />
                    Previous
                  </button>

                  <div className="notices-pagination__pages">
                    {paginationItems.map((item, index) =>
                      item === 'ellipsis' ? (
                        <span className="notices-pagination__ellipsis" key={`ellipsis-${index}`}>
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className={item === currentPage ? 'notices-pagination__page--active' : ''}
                          onClick={() => setCurrentPage(item)}
                        >
                          {String(item).padStart(2, '0')}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <HiOutlineChevronRight aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </section>
    </main>
  )
}

export default NoticesPage
