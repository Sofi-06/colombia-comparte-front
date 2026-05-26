import { type ChangeEvent, type SyntheticEvent, useState } from 'react'
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { FiLock, FiMail } from 'react-icons/fi'
import { resolveCountrySlug } from '../../config/countries'
import {
  clearStoredDashboardCountry,
  forgotPassword,
  normalizeAuthUser,
  resetPassword,
  setStoredDashboardCountry,
} from '../../services/auth'
import { getActiveCountries } from '../../services/countries'
import botIllustration from '../../assets/bot.svg'
import logoLatinoamerica from '../../assets/Latinoamérica Co N.png'
import './login.css'

const LOGIN_URL = 'https://colombia-comparte-back-ssi8.onrender.com/api/auth/login'

function getDashboardRouteByRole(role: string) {
  const normalizedRole = role.trim().toLowerCase()

  if (
    normalizedRole === 'superadmin' ||
    normalizedRole === 'admin_pais' ||
    normalizedRole === 'editor'
  ) {
    return '#/panel'
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
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('')
  const [recoveryUsername, setRecoveryUsername] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newRecoveryPassword, setNewRecoveryPassword] = useState('')
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')
  const [recoveryStatusMessage, setRecoveryStatusMessage] = useState('')
  const [recoveryStatusTone, setRecoveryStatusTone] = useState<'success' | 'error' | ''>('')

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
          payload?.message ?? payload?.error ?? 'No se pudo iniciar sesión. Revisa tus datos.'

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

      setStatusMessage('Sesión iniciada correctamente.')
      setStatusTone('success')
      globalThis.location.hash = getDashboardRouteByRole(authenticatedRole)
    } catch {
      setStatusMessage('No se pudo conectar con el servidor. Intenta nuevamente.')
      setStatusTone('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRecoveryLookup = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsRecovering(true)
    setRecoveryStatusMessage('')
    setRecoveryStatusTone('')

    try {
      const payload = await forgotPassword(recoveryIdentifier)
      setRecoveryUsername(payload.username ?? '')
      setSecurityQuestion(payload.pregunta_seguridad ?? '')
      setRecoveryStatusMessage(payload.message ?? 'Pregunta de seguridad encontrada.')
      setRecoveryStatusTone('success')
    } catch (error) {
      setRecoveryUsername('')
      setSecurityQuestion('')
      setRecoveryStatusMessage(
        error instanceof Error ? error.message : 'No fue posible iniciar la recuperación.',
      )
      setRecoveryStatusTone('error')
    } finally {
      setIsRecovering(false)
    }
  }

  const handleRecoveryReset = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsRecovering(true)
    setRecoveryStatusMessage('')
    setRecoveryStatusTone('')

    try {
      await resetPassword(recoveryUsername, securityAnswer, newRecoveryPassword)
      setRecoveryStatusMessage('Contraseña restablecida correctamente. Ya puedes iniciar sesión.')
      setRecoveryStatusTone('success')
      setIsRecoveryMode(false)
      setUsername(recoveryUsername)
      setPassword('')
      setRecoveryIdentifier('')
      setRecoveryUsername('')
      setSecurityQuestion('')
      setSecurityAnswer('')
      setNewRecoveryPassword('')
    } catch (error) {
      setRecoveryStatusMessage(
        error instanceof Error ? error.message : 'No fue posible restablecer la contraseña.',
      )
      setRecoveryStatusTone('error')
    } finally {
      setIsRecovering(false)
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
        <aside className="login-visual" aria-label="Ilustración del bot de inicio de sesión">
          <div className="login-visual__frame">
            <div className="login-visual__brand">
              <img
                src={logoLatinoamerica}
                alt="Logo Latinoamérica Comparte"
                className="login-visual__brand-img"
              />
            </div>

            <img
              className="login-visual__image"
              src={botIllustration}
              alt="Bot ilustrado señalando la tarjeta de inicio de sesión"
            />
          </div>
        </aside>

        <article className="login-card">
          <div className="login-card__content">
            <div className="login-card__copy">
              <h1 className="login-card__title" id="login-title">
                {isRecoveryMode ? 'Recupera tu acceso' : 'Inicia sesión'}
              </h1>
              <p className="login-card__text">
                {isRecoveryMode
                  ? 'Confirma tu identidad con la pregunta de seguridad y crea una nueva contraseña.'
                  : 'Entra a tu espacio para seguir acompañando historias, oportunidades y procesos que transforman vidas.'}
              </p>
            </div>

            {!isRecoveryMode ? (
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
                      autoComplete="username"
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
                      placeholder="Ingresa tu contraseña"
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

                <div className="login-form__meta">
                  <button
                    className="login-form__link-button"
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode(true)
                      setStatusMessage('')
                      setStatusTone('')
                    }}
                  >
                    Olvidé mi contraseña
                  </button>
                </div>

                {statusMessage ? (
                  <p className={`login-form__status login-form__status--${statusTone}`}>
                    {statusMessage}
                  </p>
                ) : null}

                <button className="login-form__submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                </button>
              </form>
            ) : (
              <div className="login-recovery">
                <form className="login-form" onSubmit={handleRecoveryLookup}>
                  <label className="login-form__field">
                    <span>Usuario o correo</span>
                    <div className="login-form__control">
                      <input
                        type="text"
                        name="identifier"
                        placeholder="Ingresa tu usuario o correo"
                        value={recoveryIdentifier}
                        onChange={(event) => setRecoveryIdentifier(event.target.value)}
                        required
                      />
                      <FiMail aria-hidden="true" />
                    </div>
                  </label>

                  <button className="login-form__submit" type="submit" disabled={isRecovering}>
                    {isRecovering ? 'Buscando...' : 'Buscar pregunta de seguridad'}
                  </button>
                </form>

                {securityQuestion ? (
                  <form className="login-form login-form--recovery" onSubmit={handleRecoveryReset}>
                    <div className="login-recovery__question">
                      <span>Pregunta de seguridad</span>
                      <strong>{securityQuestion}</strong>
                    </div>

                    <label className="login-form__field">
                      <span>Respuesta</span>
                      <div className="login-form__control">
                        <input
                          type="text"
                          name="security_answer"
                          placeholder="Escribe tu respuesta"
                          value={securityAnswer}
                          onChange={(event) => setSecurityAnswer(event.target.value)}
                          required
                        />
                        <FiLock aria-hidden="true" />
                      </div>
                    </label>

                    <label className="login-form__field">
                      <span>Nueva contraseña</span>
                      <div className="login-form__control">
                        <input
                          type="password"
                          name="new_password"
                          placeholder="Crea tu nueva contraseña"
                          value={newRecoveryPassword}
                          onChange={(event) => setNewRecoveryPassword(event.target.value)}
                          minLength={6}
                          required
                        />
                        <FiLock aria-hidden="true" />
                      </div>
                    </label>

                    <button className="login-form__submit" type="submit" disabled={isRecovering}>
                      {isRecovering ? 'Restableciendo...' : 'Restablecer contraseña'}
                    </button>
                  </form>
                ) : null}

                <div className="login-form__meta login-form__meta--recovery">
                  <button
                    className="login-form__link-button"
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode(false)
                      setRecoveryIdentifier('')
                      setRecoveryUsername('')
                      setSecurityQuestion('')
                      setSecurityAnswer('')
                      setNewRecoveryPassword('')
                      setRecoveryStatusMessage('')
                      setRecoveryStatusTone('')
                    }}
                  >
                    Volver al inicio de sesión
                  </button>
                </div>

                {recoveryStatusMessage ? (
                  <p className={`login-form__status login-form__status--${recoveryStatusTone}`}>
                    {recoveryStatusMessage}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  )
}

export default Login
