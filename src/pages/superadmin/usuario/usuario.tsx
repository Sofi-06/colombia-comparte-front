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
import { deleteUser, getUsers, type UserRecord } from '../../../services/users'
import './usuario.css'

type PaginationItem = number | 'ellipsis'

function getFullName(user: UserRecord) {
  return [user.nombre, user.apellido].filter(Boolean).join(' ') || 'Usuario sin nombre'
}

function getNormalizedRole(user: UserRecord) {
  return (user.rol ?? '').trim().toLowerCase()
}

function getRoleLabel(user: UserRecord) {
  return user.rol ?? (user.rol_id != null ? `Rol ${user.rol_id}` : 'Sin rol')
}

function getCountryLabel(user: UserRecord) {
  return user.pais ?? (user.pais_id != null ? `País ${user.pais_id}` : 'Sin país')
}

function getRoleTone(user: UserRecord) {
  const role = getNormalizedRole(user)

  if (role === 'superadmin') {
    return 'sun'
  }

  if (role === 'admin_pais') {
    return 'sky'
  }

  if (role === 'editor') {
    return 'coral'
  }

  return 'neutral'
}

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

function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')
  const pageSize = 6

  const loadUsers = async () => {
    setIsLoading(true)

    try {
      const records = await getUsers()
      setUsers(records)
      setStatusMessage('')
      setStatusTone('')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible cargar los usuarios.',
      )
      setStatusTone('error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase()

    if (!normalizedQuery) {
      return users
    }

    return users.filter((user) => {
      const candidates = [
        getFullName(user),
        user.email ?? '',
        user.username ?? '',
        getRoleLabel(user),
        getCountryLabel(user),
      ]

      return candidates.some((candidate) =>
        candidate.toLowerCase().includes(normalizedQuery),
      )
    })
  }, [search, users])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const paginationItems = getPaginationItems(totalPages, currentPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const handleDelete = async (user: UserRecord) => {
    if (user.id == null) {
      return
    }

    const confirmed = globalThis.confirm(
      `Vas a eliminar a ${getFullName(user)}. Esta accion no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteUser(user.id)
      setStatusMessage('Usuario eliminado correctamente.')
      setStatusTone('success')
      await loadUsers()
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible eliminar el usuario.',
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
        aria-label="Gestion de usuarios"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="usuarios"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="users-directory">
          <section className="users-directory__toolbar">
            <div className="users-directory__heading">
              <h1>Usuarios</h1>
              <p>
                {filteredUsers.length} registros
                {filteredUsers.length > pageSize ? ` · Pagina ${currentPage} de ${totalPages}` : ''}
              </p>
            </div>

            <label className="users-search users-search--toolbar" aria-label="Buscar usuarios">
              <HiOutlineMagnifyingGlass aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por nombre, correo, usuario o rol"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <div className="users-directory__actions">
              <a
                className="users-directory__button users-directory__button--primary"
                href="#/panel/usuarios/crear"
              >
                <HiOutlinePlus aria-hidden="true" />
                Crear usuario
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
              <h2>Cargando usuarios</h2>
              <p>Estamos trayendo la informacion del panel para mostrarla aqui.</p>
            </section>
          ) : filteredUsers.length === 0 ? (
            <section className="users-directory__empty">
              <h2>No encontramos usuarios con ese filtro</h2>
              <p>Ajusta la busqueda o crea un nuevo perfil.</p>
            </section>
          ) : (
            <section className="users-table-shell">
              <div className="users-table">
                <div className="users-table__head">
                  <span>Usuario</span>
                  <span>Email</span>
                  <span>Rol</span>
                  <span>Pais</span>
                  <span>Acciones</span>
                </div>

                {paginatedUsers.map((user, index) => {
                  const roleTone = getRoleTone(user)

                  return (
                    <article className="users-row" key={user.id ?? `${user.username}-${index}`}>
                      <div className="users-row__identity">
                        <span
                          className={`users-row__role-dot users-row__role-dot--${roleTone}`}
                          aria-hidden="true"
                        />

                        <div>
                          <strong>{getFullName(user)}</strong>
                          <span>@{user.username ?? 'sin-usuario'}</span>
                        </div>
                      </div>

                      <p className="users-row__cell">{user.email ?? 'Sin correo registrado'}</p>
                      <div className="users-row__cell">
                        <span className={`users-row__badge users-row__badge--${roleTone}`}>
                          {getRoleLabel(user)}
                        </span>
                      </div>
                      <p className="users-row__cell">{getCountryLabel(user)}</p>

                      <div className="users-row__actions">
                        <a
                          href={`#/panel/usuarios/editar/${user.id ?? ''}`}
                          aria-label={`Editar a ${getFullName(user)}`}
                          title="Editar usuario"
                        >
                          <HiOutlinePencilSquare aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          onClick={() => void handleDelete(user)}
                          aria-label={`Eliminar a ${getFullName(user)}`}
                          title="Eliminar usuario"
                        >
                          <HiOutlineTrash aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  )
                })}
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
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
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

export default UsersPage
