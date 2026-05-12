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
import {
  deleteContactRequest,
  getContactRequestById,
  type ContactRequestStatus,
  updateContactRequest,
  updateContactRequestStatus,
} from '../../../../services/contactRequests'
import { getActiveCountries, type CountryRecord } from '../../../../services/countries'
import '../../notices/notices.css'
import './editRequest.css'

type FormState = {
  pais_id: string
  nombre: string
  correo: string
  telefono: string
  finalidad: string
  mensaje: string
  estado: ContactRequestStatus
  observaciones_admin: string
}

const INITIAL_FORM: FormState = {
  pais_id: '',
  nombre: '',
  correo: '',
  telefono: '',
  finalidad: '',
  mensaje: '',
  estado: 'pendiente',
  observaciones_admin: '',
}

const STATUS_OPTIONS: Array<{ value: ContactRequestStatus; label: string }> = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'gestionada', label: 'Gestionada' },
  { value: 'cerrada', label: 'Cerrada' },
]

const PURPOSE_OPTIONS = ['Servicio', 'Programa EDIFICA', 'Shows y conferencias'] as const

function getRequestIdFromHash() {
  const segments = globalThis.location.hash.split('/')
  return segments[segments.length - 1] ?? ''
}

function EditRequestPage() {
  const requestId = useMemo(getRequestIdFromHash, [])
  const authUser = useMemo(getStoredAuthUser, [])
  const normalizedRole = (authUser?.rol ?? '').trim().toLowerCase()
  const canManageRequests = normalizedRole === 'superadmin' || normalizedRole === 'admin_pais'
  const canChooseCountry = isSuperadmin(authUser)
  const lockedCountryId = authUser?.pais_id != null ? String(authUser.pais_id) : ''
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [countries, setCountries] = useState<CountryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')

  useEffect(() => {
    const loadRequest = async () => {
      setIsLoading(true)

      try {
        const [countryRecords, selectedRequest] = await Promise.all([
          getActiveCountries(),
          getContactRequestById(requestId),
        ])

        setCountries(countryRecords)

        if (!selectedRequest) {
          setStatusMessage('No encontramos la solicitud que intentas abrir.')
          setStatusTone('error')
          return
        }

        const resolvedCountryId =
          selectedRequest.pais_id != null ? String(selectedRequest.pais_id) : lockedCountryId

        setForm({
          pais_id: canChooseCountry ? resolvedCountryId : lockedCountryId || resolvedCountryId,
          nombre: selectedRequest.nombre ?? '',
          correo: selectedRequest.correo ?? '',
          telefono: selectedRequest.telefono ?? '',
          finalidad: selectedRequest.finalidad ?? '',
          mensaje: selectedRequest.mensaje ?? '',
          estado: selectedRequest.estado ?? 'pendiente',
          observaciones_admin: selectedRequest.observaciones_admin ?? '',
        })
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : 'No fue posible cargar la solicitud.',
        )
        setStatusTone('error')
      } finally {
        setIsLoading(false)
      }
    }

    void loadRequest()
  }, [canChooseCountry, lockedCountryId, requestId])

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canManageRequests) {
      setStatusMessage('Tu rol solo puede consultar esta solicitud.')
      setStatusTone('error')
      return
    }

    setIsSaving(true)
    setStatusMessage('')
    setStatusTone('')

    try {
      await updateContactRequest(requestId, {
        pais_id: Number(form.pais_id),
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        finalidad: form.finalidad.trim(),
        mensaje: form.mensaje.trim(),
        estado: form.estado,
        observaciones_admin: form.observaciones_admin.trim(),
      })

      await updateContactRequestStatus(
        requestId,
        form.estado,
        form.observaciones_admin.trim(),
      )

      setStatusMessage('Solicitud actualizada correctamente.')
      setStatusTone('success')
      globalThis.setTimeout(() => {
        globalThis.location.hash = '#/panel/solicitudes'
      }, 900)
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible actualizar la solicitud.',
      )
      setStatusTone('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!canManageRequests) {
      return
    }

    const confirmed = globalThis.confirm(
      'Vas a eliminar esta solicitud. Esta accion no se puede deshacer.',
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteContactRequest(requestId)
      globalThis.location.hash = '#/panel/solicitudes'
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible eliminar la solicitud.',
      )
      setStatusTone('error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Editar solicitud"
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
                <h1>{canManageRequests ? 'Editar solicitud' : 'Detalle de solicitud'}</h1>
                <p>Consulta o actualiza la informacion registrada para este contacto.</p>
              </div>
              <a href="#/panel/solicitudes">Volver al listado</a>
            </div>

            {isLoading ? (
              <p className="notice-form-loading">Cargando informacion de la solicitud...</p>
            ) : (
              <form className="notice-form-grid" onSubmit={handleSubmit}>
                <label className="notice-form-field">
                  <span>Nombre</span>
                  <div className="notice-form-control">
                    <HiOutlineIdentification aria-hidden="true" />
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleInputChange}
                      disabled={!canManageRequests}
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
                      disabled={!canManageRequests || !countries.length || !canChooseCountry}
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
                      value={form.correo}
                      onChange={handleInputChange}
                      disabled={!canManageRequests}
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
                      value={form.telefono}
                      onChange={handleInputChange}
                      disabled={!canManageRequests}
                      required
                    />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Estado</span>
                  <div className="notice-form-control notice-form-control--select">
                    <HiOutlinePencilSquare aria-hidden="true" />
                    <select
                      name="estado"
                      value={form.estado}
                      onChange={handleInputChange}
                      disabled={!canManageRequests}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <HiMiniChevronDown className="notice-form-control__chevron" aria-hidden="true" />
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
                      disabled={!canManageRequests}
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
                      value={form.mensaje}
                      onChange={handleInputChange}
                      rows={6}
                      disabled={!canManageRequests}
                    />
                  </div>
                </label>

                <label className="notice-form-field notice-form-field--full">
                  <span>Observaciones administrativas</span>
                  <div className="notice-form-control notice-form-control--textarea">
                    <HiOutlineDocumentText aria-hidden="true" />
                    <textarea
                      name="observaciones_admin"
                      value={form.observaciones_admin}
                      onChange={handleInputChange}
                      rows={6}
                      disabled={!canManageRequests}
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
                  {canManageRequests ? (
                    <>
                      <button type="button" onClick={() => void handleDelete()} disabled={isDeleting}>
                        {isDeleting ? 'Eliminando...' : 'Eliminar solicitud'}
                      </button>
                      <button type="submit" disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Actualizar solicitud'}
                      </button>
                    </>
                  ) : null}
                </div>
              </form>
            )}
          </article>
        </div>
      </section>
    </main>
  )
}

export default EditRequestPage
