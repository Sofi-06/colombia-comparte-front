import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
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
import { createUser, type UserPayload } from '../../../../services/users'
import { getRoleIdFromValue, ROLE_OPTIONS } from '../userOptions'
import './crearUsuario.css'

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

function toPayload(form: FormState): UserPayload {
  const payload: UserPayload = {
    nombre: form.nombre.trim(),
    apellido: form.apellido.trim(),
    email: form.email.trim(),
    username: form.username.trim(),
    password: form.password,
    rol_id: getRoleIdFromValue(form.rol_id),
    pais_id: null,
  }

  if (!isSuperadminRole(form.rol_id) && form.pais_id.trim()) {
    payload.pais_id = Number(form.pais_id)
  }

  return payload
}

function CrearUsuarioPage() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [countries, setCountries] = useState<CountryRecord[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')
  const requiresCountry = form.rol_id !== '' && !isSuperadminRole(form.rol_id)

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const records = await getActiveCountries()
        setCountries(records)
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : 'No fue posible cargar los paises.',
        )
        setStatusTone('error')
      }
    }

    void loadCountries()
  }, [])

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
      setStatusMessage('Selecciona un pais para roles distintos de superadmin.')
      setStatusTone('error')
      setIsSaving(false)
      return
    }

    try {
      await createUser(toPayload(form))
      setStatusMessage('Usuario creado correctamente.')
      setStatusTone('success')
      setForm(INITIAL_FORM)
      globalThis.setTimeout(() => {
        globalThis.location.hash = '#/superadmin/usuarios'
      }, 900)
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible crear el usuario.',
      )
      setStatusTone('error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Crear usuario"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="usuarios"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="user-form-page">
          <article className="user-form-card">
            <div className="user-form-card__header">
              <h1>Crear usuario</h1>
              <a href="#/superadmin/usuarios">Volver al listado</a>
            </div>

            <form className="user-form-grid" onSubmit={handleSubmit}>
              <label className="user-form-field">
                <span>Nombre</span>
                <div className="user-form-control">
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

              <label className="user-form-field">
                <span>Apellido</span>
                <div className="user-form-control">
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

              <label className="user-form-field">
                <span>Correo</span>
                <div className="user-form-control">
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

              <label className="user-form-field">
                <span>Usuario</span>
                <div className="user-form-control">
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

              <label className="user-form-field">
                <span>Contrasena</span>
                <div className="user-form-control">
                  <HiOutlineKey aria-hidden="true" />
                  <input
                    type="password"
                    name="password"
                    placeholder="123456"
                    value={form.password}
                    onChange={handleInputChange}
                    minLength={6}
                    pattern="(?=.*[A-Za-z])(?=.*\d).{6,}"
                    title="La contrasena debe tener minimo 6 caracteres, una letra y un numero."
                    required
                  />
                </div>
              </label>

              <label className="user-form-field">
                <span>Rol</span>
                <div className="user-form-control user-form-control--select">
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
                  <HiMiniChevronDown className="user-form-control__chevron" aria-hidden="true" />
                </div>
              </label>

              <label className="user-form-field">
                <span>Pais</span>
                <div className="user-form-control user-form-control--select">
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
                        : 'Selecciona un pais'}
                    </option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.nombre}
                      </option>
                    ))}
                  </select>
                  <HiMiniChevronDown className="user-form-control__chevron" aria-hidden="true" />
                </div>
              </label>

              {statusMessage ? (
                <p className={`user-form-status user-form-status--${statusTone}`}>
                  {statusMessage}
                </p>
              ) : null}

              <div className="user-form-actions">
                <a href="#/superadmin/usuarios">Cancelar</a>
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Creando...' : 'Guardar usuario'}
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>
    </main>
  )
}

export default CrearUsuarioPage
