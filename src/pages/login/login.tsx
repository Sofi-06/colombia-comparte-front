import { type ChangeEvent, type SyntheticEvent, useState } from 'react'
import { HiOutlineArrowLeft } from 'react-icons/hi'
import { FiLock, FiMail } from 'react-icons/fi'
import './login.css'

const LOGIN_URL = 'http://localhost:3001/api/auth/login'

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
      const authenticatedUsername = payload?.username ?? payload?.user?.username ?? username

      if (token) {
        globalThis.localStorage.setItem('authToken', token)
      }

      setStatusMessage('Sesion iniciada correctamente.')
      setStatusTone('success')
      globalThis.location.hash =
        authenticatedUsername.trim().toLowerCase() === 'superadmin' ? '#/superadmin' : '#/'
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
        <article className="login-card">
          <div className="login-card__content">
            <div className="login-card__copy">
              <h1 className="login-card__title" id="login-title">
                Inicia Sesión
              </h1>
              <p className="login-card__text">
                Entra a tu espacio para seguir acompanando historias,
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
                    placeholder="Ingresa tu Usuario"
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

        <aside className="login-visual" aria-label="Espacio reservado para imagen">
          <div className="login-visual__frame">
            <div className="login-visual__placeholder">
              <span className="login-visual__tag">Imagen</span>
              <p className="login-visual__title">Espacio reservado</p>
              <p className="login-visual__text">
                Aqui podemos poner la ilustracion o foto final cuando me la pases.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Login
