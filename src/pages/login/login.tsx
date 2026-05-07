import { type ChangeEvent, type SyntheticEvent, useState } from 'react'
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { FiLock, FiMail } from 'react-icons/fi'
import { resolveCountrySlug } from '../../config/countries'
import {
  clearStoredDashboardCountry,
  normalizeAuthUser,
  setStoredDashboardCountry,
} from '../../services/auth'
import { getActiveCountries } from '../../services/countries'
import robotIllustration from '../../assets/robot.png'
import './login.css'

const LOGIN_URL = 'http://localhost:3001/api/auth/login'

function getDashboardRouteByRole(role: string) {
  const normalizedRole = role.trim().toLowerCase()

  if (
    normalizedRole === 'superadmin' ||
    normalizedRole === 'admin_pais' ||
    normalizedRole === 'editor'
  ) {
    return '#/superadmin'
  }

  return '#/'
}

async function resolveDashboardCountry(user: ReturnType<typeof normalizeAuthUser>) {
  if (user?.pais_id != null) {
    try {
      const countries = await getActiveCountries()
      const matchedCountry = countries.find(
        (country) => String(country.id) === String(user.pais_id),
      )

      if (matchedCountry) {
        return resolveCountrySlug(matchedCountry.slug ?? matchedCountry.nombre)
      }
    } catch {
      // Ignore country lookup failures and fall back to user payload fields.
    }
  }

  const candidates = [
    user?.pais_slug,
    user?.paises?.slug,
    user?.pais,
    user?.paises?.nombre,
  ]

  for (const candidate of candidates) {
    const resolved = resolveCountrySlug(candidate)

    if (resolved) {
      return resolved
    }
  }

  return ''
}

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)
    setStatusMessage('')
    setStatusTone('')

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          payload?.message ?? payload?.error ?? 'No se pudo iniciar sesion. Revisa tus datos.'

        setStatusMessage(message)
        setStatusTone('error')
        return
      }

      const token = payload?.token ?? payload?.accessToken ?? payload?.jwt
      const authenticatedUser = normalizeAuthUser(payload?.user ?? null)
      const authenticatedRole =
        authenticatedUser?.rol ??
        payload?.rol ??
        payload?.role ??
        payload?.user?.roles?.nombre ??
        ''

      if (token) {
        globalThis.localStorage.setItem('authToken', token)
      }

      if (authenticatedUser) {
        globalThis.localStorage.setItem('authUser', JSON.stringify(authenticatedUser))
      } else {
        globalThis.localStorage.removeItem('authUser')
      }

      try {
        const normalizedAuthenticatedRole =
          typeof authenticatedRole === 'string' ? authenticatedRole.trim().toLowerCase() : ''

        if (normalizedAuthenticatedRole === 'superadmin') {
          clearStoredDashboardCountry()
        } else {
          const dashboardCountry = await resolveDashboardCountry(authenticatedUser)

          if (dashboardCountry) {
            setStoredDashboardCountry(dashboardCountry)
          } else {
            clearStoredDashboardCountry()
          }
        }
      } catch {
        clearStoredDashboardCountry()
      }

      setStatusMessage('Sesion iniciada correctamente.')
      setStatusTone('success')
      globalThis.location.hash = getDashboardRouteByRole(authenticatedRole)
    } catch {
      setStatusMessage('No se pudo conectar con el servidor. Intenta nuevamente.')
      setStatusTone('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-page__glow login-page__glow--left" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--right" aria-hidden="true" />

      <a className="login-page__back" href="#inicio">
        <HiOutlineArrowLeft aria-hidden="true" />
        <span>Volver al inicio</span>
      </a>

      <section className="login-shell" aria-labelledby="login-title">
        <aside className="login-visual" aria-label="Ilustracion del robot">
          <div className="login-visual__frame">
            <img
              className="login-visual__image"
              src={robotIllustration}
              alt="Robot ilustrado de la pantalla de inicio de sesion"
            />
          </div>
        </aside>

        <article className="login-card">
          <div className="login-card__content">
            <div className="login-card__copy">
              <h1 className="login-card__title" id="login-title">
                Inicia Sesión
              </h1>
              <p className="login-card__text">
                Entra a tu espacio para seguir acompañando historias,
                oportunidades y procesos que transforman vidas.
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-form__field">
                <span>Usuario</span>
                <div className="login-form__control">
                  <input
                    type="text"
                    name="username"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"/*  */
                    required
                  />
                  <FiMail aria-hidden="true" />
                </div>
              </label>

              <label className="login-form__field">
                <span>Contraseña</span>
                <div className="login-form__control">
                  <input
                    type="password"
                    name="password"
                    placeholder="Ingresa tu contrasena"
                    value={password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />
                  <FiLock aria-hidden="true" />
                </div>
              </label>

              {statusMessage ? (
                <p className={`login-form__status login-form__status--${statusTone}`}>
                  {statusMessage}
                </p>
              ) : null}

              <button className="login-form__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </article>
      </section>
    </main>
  )
}

export default Login
