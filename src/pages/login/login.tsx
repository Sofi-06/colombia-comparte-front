import { HiOutlineArrowLeft } from 'react-icons/hi'
import { FiLock, FiMail } from 'react-icons/fi'
import './login.css'

function Login() {
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
                Inicia sesion
              </h1>
              <p className="login-card__text">
                Entra a tu espacio para seguir acompanando historias,
                oportunidades y procesos que transforman vidas.
              </p>
            </div>

            <form className="login-form">
              <label className="login-form__field">
                <span>Correo electronico</span>
                <div className="login-form__control">
                  <input type="email" name="email" placeholder="tu@correo.com" />
                  <FiMail aria-hidden="true" />
                </div>
              </label>

              <label className="login-form__field">
                <span>Contrasena</span>
                <div className="login-form__control">
                  <input
                    type="password"
                    name="password"
                    placeholder="Ingresa tu contrasena"
                  />
                  <FiLock aria-hidden="true" />
                </div>
              </label>

              <div className="login-form__meta">
                <a href="#recuperar">Olvide mi contrasena</a>
              </div>

              <button className="login-form__submit" type="submit">
                Ingresar
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
