import Banner from '../../components/banner/banner'
import NavbarTwo from '../../components/navbar2/navbartwo'
import dashboardIllustration from '../../assets/dashboard1.png'
import './superadmin.css'

type AuthUser = {
  id?: number | string
  nombre?: string
  apellido?: string
  email?: string
  username?: string
  rol?: string
  pais?: string
}

function getStoredAuthUser(): AuthUser | null {
  const rawUser = globalThis.localStorage.getItem('authUser')

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    return null
  }
}

function formatRoleLabel(role: string) {
  const normalizedRole = role.trim().toLowerCase()

  if (normalizedRole === 'superadmin') {
    return 'Panel Superadmin'
  }

  if (normalizedRole === 'admin') {
    return 'Panel Administrador'
  }

  return 'Panel de usuario'
}

function getWelcomeCopy(role: string) {
  const normalizedRole = role.trim().toLowerCase()

  if (normalizedRole === 'superadmin') {
    return 'Administra noticias, testimonios y contenido de forma centralizada.'
  }

  if (normalizedRole === 'admin') {
    return 'Gestiona la información clave de tu panel desde un solo lugar.'
  }

  return 'Bienvenido a tu espacio de gestión dentro de la plataforma.'
}

function Superadmin() {
  const authUser = getStoredAuthUser()
  const roleLabel = formatRoleLabel(authUser?.rol ?? '')
  const welcomeCopy = getWelcomeCopy(authUser?.rol ?? '')
  const displayName =
    authUser?.nombre?.trim() || authUser?.username?.trim() || 'Usuario'

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section className="superadmin-shell" aria-label="Panel superadmin">
        <NavbarTwo activeItem="dashboard" />

        <div className="superadmin-content">
          <Banner
            eyebrow={roleLabel}
            title={`Hola, ${displayName}`}
            message={welcomeCopy}
            image={dashboardIllustration}
          />

          <section className="superadmin-card">
            <p className="superadmin-card__note">
              Por ahora este espacio queda listo para mostrar métricas, accesos y controles del sistema.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Superadmin
