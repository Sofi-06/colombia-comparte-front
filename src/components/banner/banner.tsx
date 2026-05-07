import dashboardIllustration from '../../assets/dashboard1.png'
import { getStoredAuthUser, type AuthUser } from '../../services/auth'
import './banner.css'

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
