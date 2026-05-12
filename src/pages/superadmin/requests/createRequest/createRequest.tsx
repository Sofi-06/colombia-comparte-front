import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  HiMiniChevronDown,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlinePencilSquare,
} from 'react-icons/hi2'
import NavbarTwo from '../../../../components/navbar2/navbartwo'
import { getStoredAuthUser, isSuperadmin } from '../../../../services/auth'
import { createContactRequest, type ContactRequestPayload } from '../../../../services/contactRequests'
import { getActiveCountries, type CountryRecord } from '../../../../services/countries'
import '../../notices/notices.css'
import './createRequest.css'

type FormState = {
  pais_id: string
  nombre: string
  correo: string
  telefono: string
  finalidad: string
  mensaje: string
}

const INITIAL_FORM: FormState = {
  pais_id: '',
  nombre: '',
  correo: '',
  telefono: '',
  finalidad: '',
  mensaje: '',
}

const PURPOSE_OPTIONS = ['Servicio', 'Programa EDIFICA', 'Shows y conferencias'] as const

function toPayload(form: FormState): ContactRequestPayload {
  return {
    pais_id: Number(form.pais_id),
    nombre: form.nombre.trim(),
    correo: form.correo.trim(),
    telefono: form.telefono.trim(),
    finalidad: form.finalidad.trim(),
    mensaje: form.mensaje.trim(),
  }
}

function CreateRequestPage() {
  const authUser = useMemo(getStoredAuthUser, [])
  const canChooseCountry = isSuperadmin(authUser)
  const lockedCountryId = authUser?.pais_id != null ? String(authUser.pais_id) : ''
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    pais_id: canChooseCountry ? '' : lockedCountryId,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [countries, setCountries] = useState<CountryRecord[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')

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
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setStatusMessage('')
    setStatusTone('')

    if (!form.pais_id) {
      setStatusMessage('Selecciona el pais de la solicitud.')
      setStatusTone('error')
      setIsSaving(false)
      return
    }

    try {
      await createContactRequest(toPayload(form))
      setStatusMessage('Solicitud creada correctamente.')
      setStatusTone('success')
      globalThis.setTimeout(() => {
        globalThis.location.hash = '#/panel/solicitudes'
      }, 900)
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible crear la solicitud.',
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
        aria-label="Crear solicitud"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="solicitudes"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="notice-form-page">
          <article className="notice-form-card">
            <div className="notice-form-card__header">
              <div>
                <h1>Crear solicitud</h1>
                <p>Registra una nueva solicitud y asignale el pais correspondiente.</p>
              </div>
              <a href="#/panel/solicitudes">Volver al listado</a>
            </div>

            <form className="notice-form-grid" onSubmit={handleSubmit}>
              <label className="notice-form-field">
                <span>Nombre</span>
                <div className="notice-form-control">
                  <HiOutlineIdentification aria-hidden="true" />
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del contacto"
                    value={form.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </label>

              <label className="notice-form-field">
                <span>Pais</span>
                <div className="notice-form-control notice-form-control--select">
                  <HiOutlineGlobeAlt aria-hidden="true" />
                  <select
                    name="pais_id"
                    value={form.pais_id}
                    onChange={handleInputChange}
                    disabled={!countries.length || !canChooseCountry}
                    required
                  >
                    <option value="">
                      {canChooseCountry ? 'Selecciona un pais' : 'Pais asignado por tu rol'}
                    </option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.nombre}
                      </option>
                    ))}
                  </select>
                  <HiMiniChevronDown className="notice-form-control__chevron" aria-hidden="true" />
                </div>
              </label>

              <label className="notice-form-field">
                <span>Correo</span>
                <div className="notice-form-control">
                  <HiOutlineEnvelope aria-hidden="true" />
                  <input
                    type="email"
                    name="correo"
                    placeholder="correo@ejemplo.com"
                    value={form.correo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </label>

              <label className="notice-form-field">
                <span>Telefono</span>
                <div className="notice-form-control">
                  <HiOutlinePhone aria-hidden="true" />
                  <input
                    type="text"
                    name="telefono"
                    placeholder="3001234567"
                    value={form.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </label>

              <label className="notice-form-field notice-form-field--full">
                <span>Finalidad</span>
                <div className="notice-form-control notice-form-control--select">
                  <HiOutlinePencilSquare aria-hidden="true" />
                  <select
                    name="finalidad"
                    value={form.finalidad}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona una finalidad</option>
                    {PURPOSE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <HiMiniChevronDown className="notice-form-control__chevron" aria-hidden="true" />
                </div>
              </label>

              <label className="notice-form-field notice-form-field--full">
                <span>Mensaje</span>
                <div className="notice-form-control notice-form-control--textarea">
                  <HiOutlineDocumentText aria-hidden="true" />
                  <textarea
                    name="mensaje"
                    placeholder="Detalle adicional de la solicitud"
                    value={form.mensaje}
                    onChange={handleInputChange}
                    rows={8}
                  />
                </div>
              </label>

              {statusMessage ? (
                <p className={`notice-form-status notice-form-status--${statusTone}`}>
                  {statusMessage}
                </p>
              ) : null}

              <div className="notice-form-actions">
                <a href="#/panel/solicitudes">Cancelar</a>
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Creando...' : 'Guardar solicitud'}
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>
    </main>
  )
}

export default CreateRequestPage
