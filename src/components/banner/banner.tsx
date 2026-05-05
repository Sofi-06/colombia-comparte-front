import dashboardIllustration from '../../assets/dashboard1.png'
import './banner.css'

type AuthUser = {
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
  } | null
}

function getStoredAuthUser(): AuthUser | null {
  const rawUser = globalThis.localStorage.getItem('authUser')

  if (!rawUser) {
    return null
  }

  try {
    const user = JSON.parse(rawUser) as AuthUser

    return {
      ...user,
      rol: user.rol ?? user.roles?.nombre ?? '',
      rol_id: user.rol_id ?? user.roles?.id ?? null,
      pais: user.pais ?? user.paises?.nombre ?? '',
      pais_id: user.pais_id ?? user.paises?.id ?? null,
    }
  } catch {
    return null
  }
}

function formatRoleLabel(role: string) {
  const normalizedRole = role.trim().toLowerCase()

  if (normalizedRole === 'superadmin') {
    return 'Panel Superadmin'
  }

  if (normalizedRole === 'admin_pais') {
    return 'Panel Admin Pais'
  }

  if (normalizedRole === 'editor') {
    return 'Panel Editor'
  }

  return 'Panel de usuario'
}

function getWelcomeCopy(role: string) {
  const normalizedRole = role.trim().toLowerCase()

  if (normalizedRole === 'superadmin') {
    return 'Administra noticias, testimonios y contenido de forma centralizada.'
  }

  if (normalizedRole === 'admin_pais') {
    return 'Coordina publicaciones, usuarios y contexto operativo de tu pais.'
  }

  if (normalizedRole === 'editor') {
    return 'Escribe, actualiza y cuida la calidad del contenido publicado.'
  }

  return 'Bienvenido a tu espacio de gestion dentro de la plataforma.'
}

function getDisplayName(user: AuthUser | null) {
  const normalizedRole = user?.rol?.trim().toLowerCase() ?? ''

  if (normalizedRole === 'superadmin') {
    return 'superadmin'
  }

  return user?.nombre?.trim() || user?.username?.trim() || 'Usuario'
}

function Banner() {
  const authUser = getStoredAuthUser()
  const eyebrow = formatRoleLabel(authUser?.rol ?? '')
  const title = `Hola, ${getDisplayName(authUser)}`
  const message = getWelcomeCopy(authUser?.rol ?? '')

  return (
    <article className="banner">
      <div className="banner__content">
        <p className="banner__eyebrow">{eyebrow}</p>
        <h1 className="banner__title">{title}</h1>
        <p className="banner__text">{message}</p>
      </div>

      <div className="banner__media" aria-hidden="true">
        <img className="banner__image" src={dashboardIllustration} alt="" />
      </div>
    </article>
  )
}

export default Banner
