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
import { getStoredAuthUser, isSuperadmin } from '../../../services/auth'
import { deleteCountry, getCountries, type CountryRecord } from '../../../services/countries'
import '../usuario/usuario.css'
import './countries.css'

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

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

function formatDate(value?: string) {
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

function CountriesPage() {
  const authUser = useMemo(getStoredAuthUser, [])
  const canAccess = isSuperadmin(authUser)
  const [countries, setCountries] = useState<CountryRecord[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')
  const pageSize = 6

  const loadCountries = async () => {
    setIsLoading(true)

    try {
      const records = await getCountries()
      setCountries(records)
      setStatusMessage('')
      setStatusTone('')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible cargar los paises.',
      )
      setStatusTone('error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!canAccess) {
      globalThis.location.replace('#/panel')
      return
    }

    void loadCountries()
  }, [canAccess])

  const filteredCountries = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase()

    if (!normalizedQuery) {
      return countries
    }

    return countries.filter((country) =>
      [country.nombre ?? '', country.codigo ?? '', country.slug ?? '', country.estado ?? '']
        .some((candidate) => candidate.toLowerCase().includes(normalizedQuery)),
    )
  }, [countries, search])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filteredCountries.length / pageSize))
  const paginationItems = getPaginationItems(totalPages, currentPage)
  const paginatedCountries = filteredCountries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const handleDelete = async (country: CountryRecord) => {
    if (country.id == null) {
      return
    }

    const confirmed = globalThis.confirm(
      `Vas a eliminar el pais ${country.nombre ?? 'seleccionado'}. Esta accion no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteCountry(country.id)
      setStatusMessage('Pais eliminado correctamente.')
      setStatusTone('success')
      await loadCountries()
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible eliminar el pais.',
      )
      setStatusTone('error')
    }
  }

  if (!canAccess) {
    return null
  }

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Gestion de paises"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="paises"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="users-directory countries-directory">
          <section className="users-directory__toolbar">
            <div className="users-directory__heading">
              <h1>Paises</h1>
              <p>
                {filteredCountries.length} registros
                {filteredCountries.length > pageSize ? ` · Pagina ${currentPage} de ${totalPages}` : ''}
              </p>
            </div>

            <label className="users-search users-search--toolbar" aria-label="Buscar paises">
              <HiOutlineMagnifyingGlass aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por nombre, codigo, slug o estado"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <div className="users-directory__actions">
              <a
                className="users-directory__button users-directory__button--primary"
                href="#/panel/paises/crear"
              >
                <HiOutlinePlus aria-hidden="true" />
                Crear pais
              </a>
            </div>
          </section>

          {statusMessage ? (
            <p className={`users-directory__status users-directory__status--${statusTone}`}>
              {statusMessage}
            </p>
          ) : null}

          {isLoading ? (
            <section className="users-directory__empty">
              <h2>Cargando paises</h2>
              <p>Estamos trayendo la configuracion disponible del sistema.</p>
            </section>
          ) : filteredCountries.length === 0 ? (
            <section className="users-directory__empty">
              <h2>No encontramos paises con ese filtro</h2>
              <p>Puedes ajustar la busqueda o crear uno nuevo.</p>
            </section>
          ) : (
            <section className="users-table-shell">
              <div className="users-table">
                <div className="users-table__head">
                  <span>Pais</span>
                  <span>Codigo</span>
                  <span>Slug</span>
                  <span>Estado</span>
                  <span>Acciones</span>
                </div>

                {paginatedCountries.map((country, index) => (
                  <article className="users-row" key={country.id ?? `${country.slug}-${index}`}>
                    <div className="users-row__identity">
                      <span className="users-row__role-dot users-row__role-dot--sky" aria-hidden="true" />
                      <div>
                        <strong>{country.nombre ?? 'Pais sin nombre'}</strong>
                        <span>Creado: {formatDate(country.created_at)}</span>
                      </div>
                    </div>

                    <p className="users-row__cell">{country.codigo ?? 'Sin codigo'}</p>
                    <p className="users-row__cell">{country.slug ?? 'Sin slug'}</p>
                    <div className="users-row__cell">
                      <span
                        className={`users-row__badge users-row__badge--${
                          country.estado === 'activo' ? 'sky' : 'neutral'
                        }`}
                      >
                        {country.estado ?? 'Sin estado'}
                      </span>
                    </div>
                    <div className="users-row__actions">
                      <a
                        href={`#/panel/paises/editar/${country.id ?? ''}`}
                        aria-label={`Editar ${country.nombre ?? 'pais'}`}
                        title="Editar pais"
                      >
                        <HiOutlinePencilSquare aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onClick={() => void handleDelete(country)}
                        aria-label={`Eliminar ${country.nombre ?? 'pais'}`}
                        title="Eliminar pais"
                      >
                        <HiOutlineTrash aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="users-pagination">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                  >
                    <HiOutlineChevronLeft aria-hidden="true" />
                    Previous
                  </button>

                  <div className="users-pagination__pages">
                    {paginationItems.map((item, index) =>
                      item === 'ellipsis' ? (
                        <span className="users-pagination__ellipsis" key={`ellipsis-${index}`}>
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className={item === currentPage ? 'users-pagination__page--active' : ''}
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

export default CountriesPage
