import { type FormEvent, useState } from 'react'
import Banner from '../../components/banner/banner'
import NavbarTwo from '../../components/navbar2/navbartwo'
import { changeOwnPassword, updateSecurityQuestion } from '../../services/auth'
import './superadmin.css'

function Superadmin() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordTone, setPasswordTone] = useState<'success' | 'error' | ''>('')
  const [securityMessage, setSecurityMessage] = useState('')
  const [securityTone, setSecurityTone] = useState<'success' | 'error' | ''>('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false)

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsUpdatingPassword(true)
    setPasswordMessage('')
    setPasswordTone('')

    try {
      await changeOwnPassword(currentPassword, newPassword)
      setPasswordMessage('Contraseña actualizada correctamente.')
      setPasswordTone('success')
      setCurrentPassword('')
      setNewPassword('')
    } catch (error) {
      setPasswordMessage(
        error instanceof Error ? error.message : 'No fue posible actualizar la contraseña.',
      )
      setPasswordTone('error')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleSecuritySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsUpdatingSecurity(true)
    setSecurityMessage('')
    setSecurityTone('')

    try {
      await updateSecurityQuestion(securityQuestion, securityAnswer)
      setSecurityMessage('Pregunta y respuesta de seguridad actualizadas correctamente.')
      setSecurityTone('success')
      setSecurityQuestion('')
      setSecurityAnswer('')
    } catch (error) {
      setSecurityMessage(
        error instanceof Error
          ? error.message
          : 'No fue posible actualizar la seguridad de tu cuenta.',
      )
      setSecurityTone('error')
    } finally {
      setIsUpdatingSecurity(false)
    }
  }

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Panel principal"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="dashboard"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="superadmin-content">
          <Banner />

          <section className="superadmin-card">
            <p className="superadmin-card__note">
              Este espacio queda listo para mostrar métricas, accesos y controles
              según el rol con el que iniciaste sesión.
            </p>
          </section>

          <section className="superadmin-card superadmin-settings">
            <article className="superadmin-settings__panel">
              <h2>Cambiar mi contraseña</h2>
              <form className="superadmin-settings__form" onSubmit={handlePasswordSubmit}>
                <label>
                  <span>Contraseña actual</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Nueva contraseña</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    minLength={6}
                    required
                  />
                </label>

                {passwordMessage ? (
                  <p className={`superadmin-settings__status superadmin-settings__status--${passwordTone}`}>
                    {passwordMessage}
                  </p>
                ) : null}

                <button type="submit" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </form>
            </article>

            <article className="superadmin-settings__panel">
              <h2>Pregunta de seguridad</h2>
              <form className="superadmin-settings__form" onSubmit={handleSecuritySubmit}>
                <label>
                  <span>Nueva pregunta</span>
                  <input
                    type="text"
                    value={securityQuestion}
                    onChange={(event) => setSecurityQuestion(event.target.value)}
                    placeholder="¿Cual es tu ciudad favorita?"
                    required
                  />
                </label>
                <label>
                  <span>Nueva respuesta</span>
                  <input
                    type="text"
                    value={securityAnswer}
                    onChange={(event) => setSecurityAnswer(event.target.value)}
                    placeholder="Escribe tu respuesta"
                    required
                  />
                </label>

                {securityMessage ? (
                  <p className={`superadmin-settings__status superadmin-settings__status--${securityTone}`}>
                    {securityMessage}
                  </p>
                ) : null}

                <button type="submit" disabled={isUpdatingSecurity}>
                  {isUpdatingSecurity ? 'Guardando...' : 'Actualizar seguridad'}
                </button>
              </form>
            </article>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Superadmin
