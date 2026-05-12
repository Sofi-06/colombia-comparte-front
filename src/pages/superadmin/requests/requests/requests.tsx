import { useEffect, useMemo, useState } from 'react'
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
} from 'react-icons/hi2'
import NavbarTwo from '../../../../components/navbar2/navbartwo'
import { getStoredAuthUser } from '../../../../services/auth'
import {
  deleteContactRequest,
  getContactRequestCountryLabel,
  getContactRequests,
  type ContactRequestRecord,
  type ContactRequestStatus,
} from '../../../../services/contactRequests'
import '../../notices/notices.css'
import './requests.css'

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

function getStatusLabel(status: ContactRequestStatus | undefined) {
  switch (status) {
    case 'en_proceso':
      return 'En proceso'
    case 'gestionada':
      return 'Gestionada'
    case 'cerrada':
      return 'Cerrada'
    case 'pendiente':
    default:
      return 'Pendiente'
  }
}

function formatDate(value?: string | null) {
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

function RequestsPage() {
  const authUser = useMemo(getStoredAuthUser, [])
  const normalizedRole = (authUser?.rol ?? '').trim().toLowerCase()
  const canManageRequests = normalizedRole === 'superadmin' || normalizedRole === 'admin_pais'
  const [requests, setRequests] = useState<ContactRequestRecord[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')
  const pageSize = 6

  const loadRequests = async () => {
    setIsLoading(true)

    try {
      const records = await getContactRequests()
      setRequests(records)
      setStatusMessage('')
      setStatusTone('')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible cargar las solicitudes.',
      )
      setStatusTone('error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadRequests()
  }, [])

  const filteredRequests = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase()

    if (!normalizedQuery) {
      return requests
    }

    return requests.filter((request) => {
      const candidates = [
        request.nombre ?? '',
        request.correo ?? '',
        request.telefono ?? '',
        request.finalidad ?? '',
        request.mensaje ?? '',
        request.estado ?? '',
        request.observaciones_admin ?? '',
        getContactRequestCountryLabel(request),
      ]

      return candidates.some((candidate) =>
        candidate.toLowerCase().includes(normalizedQuery),
      )
    })
  }, [requests, search])

  const metrics = useMemo(
    () => ({
      total: requests.length,
      pendientes: requests.filter((request) => request.estado === 'pendiente').length,
      enProceso: requests.filter((request) => request.estado === 'en_proceso').length,
      cerradas: requests.filter(
        (request) => request.estado === 'gestionada' || request.estado === 'cerrada',
      ).length,
    }),
    [requests],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize))
  const paginationItems = getPaginationItems(totalPages, currentPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const handleDelete = async (request: ContactRequestRecord) => {
    if (request.id == null) {
      return
    }

    const confirmed = globalThis.confirm(
      `Vas a eliminar la solicitud de ${request.nombre ?? 'este contacto'}. Esta accion no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteContactRequest(request.id)
      setStatusMessage('Solicitud eliminada correctamente.')
      setStatusTone('success')
      await loadRequests()
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible eliminar la solicitud.',
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
        aria-label="Gestion de solicitudes"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="solicitudes"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="notices-directory">
          <section className="requests-hero">
            <div>
              <h1>Solicitudes</h1>
              <p>
                Gestiona los contactos recibidos y haz seguimiento al estado de cada caso.
              </p>
            </div>

            <div className="requests-summary">
              <article>
                <strong>{metrics.total}</strong>
                <span>Total registradas</span>
              </article>
              <article>
                <strong>{metrics.pendientes}</strong>
                <span>Pendientes</span>
              </article>
              <article>
                <strong>{metrics.enProceso}</strong>
                <span>En proceso</span>
              </article>
              <article>
                <strong>{metrics.cerradas}</strong>
                <span>Gestionadas o cerradas</span>
              </article>
            </div>
          </section>

          <section className="notices-directory__toolbar">
            <div className="notices-directory__heading">
              <h1>Solicitudes</h1>
              <p>
                {filteredRequests.length} registros
                {filteredRequests.length > pageSize ? ` · Pagina ${currentPage} de ${totalPages}` : ''}
              </p>
            </div>

            <label className="notices-search" aria-label="Buscar solicitudes">
              <HiOutlineMagnifyingGlass aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por nombre, correo, estado o pais"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <div className="notices-directory__actions">
              {canManageRequests ? (
                <a
                  className="notices-directory__button notices-directory__button--primary"
                  href="#/panel/solicitudes/crear"
                >
                  <HiOutlinePlus aria-hidden="true" />
                  Crear solicitud
                </a>
              ) : null}
            </div>
          </section>

          {statusMessage ? (
            <p className={`notices-directory__status notices-directory__status--${statusTone}`}>
              {statusMessage}
            </p>
          ) : null}

          {isLoading ? (
            <section className="notices-directory__empty">
              <h2>Cargando solicitudes</h2>
              <p>Estamos trayendo los registros del panel para mostrarlos aqui.</p>
            </section>
          ) : filteredRequests.length === 0 ? (
            <section className="notices-directory__empty">
              <h2>No encontramos solicitudes con ese filtro</h2>
              <p>Puedes ajustar la busqueda o esperar nuevos registros.</p>
            </section>
          ) : (
            <section className="notices-table-shell">
              <div className="notices-table">
                <div className="notices-table__head">
                  <span>Contacto</span>
                  <span>Pais</span>
                  <span>Estado</span>
                  <span>Fecha</span>
                  <span>Acciones</span>
                </div>

                {paginatedRequests.map((request, index) => (
                  <article className="notices-row" key={request.id ?? `${request.correo}-${index}`}>
                    <div className="notices-row__identity">
                      <strong>{request.nombre ?? 'Solicitud sin nombre'}</strong>
                      <span className="notices-row__excerpt">
                        {request.finalidad ?? request.correo ?? 'Sin detalle adicional'}
                      </span>
                    </div>

                    <p className="notices-row__cell">{getContactRequestCountryLabel(request)}</p>
                    <div className="notices-row__cell">
                      <span className={`requests-badge requests-badge--${request.estado ?? 'pendiente'}`}>
                        {getStatusLabel(request.estado)}
                      </span>
                    </div>
                    <p className="notices-row__cell">{formatDate(request.created_at)}</p>

                    <div className="notices-row__actions">
                      {canManageRequests ? (
                        <>
                          <a
                            href={`#/panel/solicitudes/editar/${request.id ?? ''}`}
                            aria-label={`Editar ${request.nombre ?? 'solicitud'}`}
                            title="Editar solicitud"
                          >
                            <HiOutlinePencilSquare aria-hidden="true" />
                          </a>
                          <button
                            type="button"
                            onClick={() => void handleDelete(request)}
                            aria-label={`Eliminar ${request.nombre ?? 'solicitud'}`}
                            title="Eliminar solicitud"
                          >
                            <HiOutlineTrash aria-hidden="true" />
                          </button>
                        </>
                      ) : (
                        <a
                          href={`#/panel/solicitudes/editar/${request.id ?? ''}`}
                          aria-label={`Ver ${request.nombre ?? 'solicitud'}`}
                          title="Ver solicitud"
                        >
                          <HiOutlinePencilSquare aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
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

export default RequestsPage
