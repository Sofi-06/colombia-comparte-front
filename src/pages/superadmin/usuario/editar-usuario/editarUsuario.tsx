import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  HiMiniChevronDown,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
  HiOutlineKey,
  HiOutlinePencilSquare,
  HiOutlineUser,
  HiOutlineUserCircle,
} from 'react-icons/hi2'
import NavbarTwo from '../../../../components/navbar2/navbartwo'
import { getActiveCountries, type CountryRecord } from '../../../../services/countries'
import { getUsers, type UserPayload, updateUser, updateUserPassword } from '../../../../services/users'
import {
  getRoleIdFromValue,
  getRoleValueFromRecord,
  ROLE_OPTIONS,
} from '../userOptions'
import './editarUsuario.css'

type FormState = {
  nombre: string
  apellido: string
  email: string
  username: string
  password: string
  rol_id: string
  pais_id: string
}

const INITIAL_FORM: FormState = {
  nombre: '',
  apellido: '',
  email: '',
  username: '',
  password: '',
  rol_id: '',
  pais_id: '',
}

function isSuperadminRole(roleValue: string) {
  return roleValue === 'superadmin'
}

function getUserIdFromHash() {
  const segments = globalThis.location.hash.split('/')
  return segments[segments.length - 1] ?? ''
}

function toPayload(form: FormState): UserPayload {
  const payload: UserPayload = {
    nombre: form.nombre.trim(),
    apellido: form.apellido.trim(),
    email: form.email.trim(),
    username: form.username.trim(),
    rol_id: getRoleIdFromValue(form.rol_id),
    pais_id: null,
  }

  if (!isSuperadminRole(form.rol_id) && form.pais_id.trim()) {
    payload.pais_id = Number(form.pais_id)
  }

  return payload
}

function EditarUsuarioPage() {
  const userId = useMemo(getUserIdFromHash, [])
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [countries, setCountries] = useState<CountryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')
  const [passwordStatusMessage, setPasswordStatusMessage] = useState('')
  const [passwordStatusTone, setPasswordStatusTone] = useState<'success' | 'error' | ''>('')
  const requiresCountry = form.rol_id !== '' && !isSuperadminRole(form.rol_id)

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)

      try {
        const [users, countryRecords] = await Promise.all([
          getUsers(),
          getActiveCountries(),
        ])
        setCountries(countryRecords)
        const selectedUser = users.find((user) => String(user.id) === String(userId))

        if (!selectedUser) {
          setStatusMessage('No encontramos el usuario que intentas editar.')
          setStatusTone('error')
          return
        }

        setForm({
          nombre: selectedUser.nombre ?? '',
          apellido: selectedUser.apellido ?? '',
          email: selectedUser.email ?? '',
          username: selectedUser.username ?? '',
          password: '',
          rol_id: getRoleValueFromRecord(selectedUser.rol_id, selectedUser.rol),
          pais_id: selectedUser.pais_id != null ? String(selectedUser.pais_id) : '',
        })
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : 'No fue posible cargar el usuario.',
        )
        setStatusTone('error')
      } finally {
        setIsLoading(false)
      }
    }

    void loadUser()
  }, [userId])

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => {
      if (name === 'rol_id') {
        return {
          ...current,
          rol_id: value,
          pais_id: isSuperadminRole(value) ? '' : current.pais_id,
        }
      }

      return { ...current, [name]: value }
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setStatusMessage('')
    setStatusTone('')

    if (requiresCountry && !form.pais_id) {
      setStatusMessage('Selecciona un país para roles distintos de superadmin.')
      setStatusTone('error')
      setIsSaving(false)
      return
    }

    try {
      await updateUser(userId, toPayload(form))
      setStatusMessage('Usuario actualizado correctamente.')
      setStatusTone('success')
      globalThis.setTimeout(() => {
        globalThis.location.hash = '#/superadmin/usuarios'
      }, 900)
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible actualizar el usuario.',
      )
      setStatusTone('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.password.trim()) {
      setPasswordStatusMessage('Escribe una nueva contraseña para este usuario.')
      setPasswordStatusTone('error')
      return
    }

    setIsSavingPassword(true)
    setPasswordStatusMessage('')
    setPasswordStatusTone('')

    try {
      await updateUserPassword(userId, form.password.trim())
      setPasswordStatusMessage('Contraseña actualizada correctamente.')
      setPasswordStatusTone('success')
      setForm((current) => ({ ...current, password: '' }))
    } catch (error) {
      setPasswordStatusMessage(
        error instanceof Error ? error.message : 'No fue posible actualizar la contraseña.',
      )
      setPasswordStatusTone('error')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Editar usuario"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="usuarios"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="edit-user-page">
          <article className="edit-user-card">
            <div className="edit-user-card__header">
              <h1>Editar usuario</h1>
              <a href="#/superadmin/usuarios">Volver al listado</a>
            </div>

            {isLoading ? (
              <p className="edit-user-status">Cargando información del usuario...</p>
            ) : (
              <form className="edit-user-grid" onSubmit={handleSubmit}>
                <label className="edit-user-field">
                  <span>Nombre</span>
                  <div className="edit-user-control">
                    <HiOutlineUser aria-hidden="true" />
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Juan"
                      value={form.nombre}
                      onChange={handleInputChange}
                      minLength={2}
                      pattern="[A-Za-zÀ-ÿ\s]+"
                      title="Ingresa un nombre valido usando solo letras."
                      required
                    />
                  </div>
                </label>

                <label className="edit-user-field">
                  <span>Apellido</span>
                  <div className="edit-user-control">
                    <HiOutlineUserCircle aria-hidden="true" />
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Perez"
                      value={form.apellido}
                      onChange={handleInputChange}
                      minLength={2}
                      pattern="[A-Za-zÀ-ÿ\s]+"
                      title="Ingresa un apellido valido usando solo letras."
                      required
                    />
                  </div>
                </label>

                <label className="edit-user-field">
                  <span>Correo</span>
                  <div className="edit-user-control">
                    <HiOutlineEnvelope aria-hidden="true" />
                    <input
                      type="email"
                      name="email"
                      placeholder="juan@mail.com"
                      value={form.email}
                      onChange={handleInputChange}
                      maxLength={120}
                      required
                    />
                  </div>
                </label>

                <label className="edit-user-field">
                  <span>Usuario</span>
                  <div className="edit-user-control">
                    <HiOutlineIdentification aria-hidden="true" />
                    <input
                      type="text"
                      name="username"
                      placeholder="juanp"
                      value={form.username}
                      onChange={handleInputChange}
                      minLength={4}
                      maxLength={24}
                      pattern="[A-Za-z0-9._-]+"
                      title="Usa entre 4 y 24 caracteres sin espacios."
                      required
                    />
                  </div>
                </label>

                <label className="edit-user-field">
                  <span>Rol</span>
                  <div className="edit-user-control edit-user-control--select">
                    <HiOutlinePencilSquare aria-hidden="true" />
                    <select
                      name="rol_id"
                      value={form.rol_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un rol</option>
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <HiMiniChevronDown className="edit-user-control__chevron" aria-hidden="true" />
                  </div>
                </label>

                <label className="edit-user-field">
                  <span>País</span>
                  <div className="edit-user-control edit-user-control--select">
                    <HiOutlineGlobeAlt aria-hidden="true" />
                    <select
                      name="pais_id"
                      value={form.pais_id}
                      onChange={handleInputChange}
                      disabled={!countries.length || isSuperadminRole(form.rol_id)}
                      required={requiresCountry}
                    >
                      <option value="">
                        {isSuperadminRole(form.rol_id)
                          ? 'No aplica para superadmin'
                          : 'Selecciona un país'}
                      </option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.nombre}
                        </option>
                      ))}
                    </select>
                    <HiMiniChevronDown className="edit-user-control__chevron" aria-hidden="true" />
                  </div>
                </label>

                {statusMessage ? (
                  <p className={`edit-user-status edit-user-status--${statusTone}`}>
                    {statusMessage}
                  </p>
                ) : null}

                <div className="edit-user-actions">
                  <a href="#/superadmin/usuarios">Cancelar</a>
                  <button type="submit" disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Actualizar usuario'}
                  </button>
                </div>
              </form>
            )}

            {!isLoading ? (
              <form className="edit-user-password-card" onSubmit={handlePasswordSubmit}>
                <div className="edit-user-password-card__header">
                  <h2>Cambiar contraseña del usuario</h2>
                  <p>Usa este bloque solo si necesitas asignar una nueva contraseña.</p>
                </div>

                <label className="edit-user-field">
                  <span>Nueva contraseña</span>
                  <div className="edit-user-control">
                    <HiOutlineKey aria-hidden="true" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Escribe la nueva contraseña"
                      value={form.password}
                      onChange={handleInputChange}
                      minLength={6}
                      pattern="(?=.*[A-Za-z])(?=.*\d).{6,}"
                      title="Usa minimo 6 caracteres, una letra y un numero."
                    />
                  </div>
                </label>

                {passwordStatusMessage ? (
                  <p className={`edit-user-status edit-user-status--${passwordStatusTone}`}>
                    {passwordStatusMessage}
                  </p>
                ) : null}

                <div className="edit-user-password-card__actions">
                  <button type="submit" disabled={isSavingPassword}>
                    {isSavingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                  </button>
                </div>
              </form>
            ) : null}
          </article>
        </div>
      </section>
    </main>
  )
}

export default EditarUsuarioPage
