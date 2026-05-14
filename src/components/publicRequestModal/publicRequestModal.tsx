import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  HiMiniChevronDown,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlineXMark,
} from 'react-icons/hi2'
import {
  countryConfigs,
  publicCountryOptions,
  type CountrySlug,
} from '../../config/countries'
import { createContactRequest } from '../../services/contactRequests'
import './publicRequestModal.css'

type PublicRequestModalProps = {
  isOpen: boolean
  onClose: () => void
  initialCountrySlug?: CountrySlug | null
  initialPurpose?: 'Servicio' | 'Programa EDIFICA' | 'Shows y conferencias'
  title?: string
  subtitle?: string
}

type FormState = {
  pais_id: string
  nombre: string
  correo: string
  telefono: string
  finalidad: string
  mensaje: string
}

const PURPOSE_OPTIONS = ['Servicio', 'Programa EDIFICA', 'Shows y conferencias'] as const

const INITIAL_FORM: FormState = {
  pais_id: '',
  nombre: '',
  correo: '',
  telefono: '',
  finalidad: 'Servicio',
  mensaje: '',
}

function PublicRequestModal({
  isOpen,
  onClose,
  initialCountrySlug = null,
  initialPurpose = 'Servicio',
  title = 'Solicitud de informacion',
  subtitle = 'Comparte tus datos y nuestro equipo te contactara sin salir de esta pagina.',
}: PublicRequestModalProps) {
  const defaultCountryId = initialCountrySlug ? String(countryConfigs[initialCountrySlug].id) : ''
  const initialCountryName = initialCountrySlug ? countryConfigs[initialCountrySlug].name : ''
  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    pais_id: defaultCountryId,
    finalidad: initialPurpose,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setForm({
      ...INITIAL_FORM,
      pais_id: defaultCountryId,
      finalidad: initialPurpose,
    })
    setStatusMessage('')
    setStatusTone('')
  }, [defaultCountryId, initialPurpose, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      globalThis.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const showCountrySelect = !initialCountrySlug
  const countryLabel = useMemo(() => {
    if (showCountrySelect) {
      return ''
    }

    return initialCountryName
  }, [initialCountryName, showCountrySelect])

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
      setStatusMessage('Selecciona el pais para registrar la solicitud.')
      setStatusTone('error')
      setIsSaving(false)
      return
    }

    try {
      await createContactRequest({
        pais_id: Number(form.pais_id),
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        finalidad: form.finalidad.trim(),
        mensaje: form.mensaje.trim(),
      })
      setStatusMessage('Solicitud enviada correctamente. Pronto nos pondremos en contacto contigo.')
      setStatusTone('success')
      setForm({
        ...INITIAL_FORM,
        pais_id: defaultCountryId,
        finalidad: initialPurpose,
      })
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible enviar la solicitud.',
      )
      setStatusTone('error')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="public-request-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="public-request-modal-title"
      onClick={onClose}
    >
      <div
        className="public-request-modal__card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="public-request-modal__close"
          onClick={onClose}
          aria-label="Cerrar formulario"
        >
          <HiOutlineXMark aria-hidden="true" />
        </button>

        <div className="public-request-modal__header">
          <p className="public-request-modal__eyebrow">SOLICITUD</p>
          <h2 id="public-request-modal-title">{title}</h2>
          <p>{subtitle}</p>
        </div>

        <form className="public-request-modal__form" onSubmit={handleSubmit}>
          <label className="public-request-modal__field">
            <span>Nombre</span>
            <div className="public-request-modal__control">
              <HiOutlineIdentification aria-hidden="true" />
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
          </label>

          {showCountrySelect ? (
            <label className="public-request-modal__field">
              <span>Pais</span>
              <div className="public-request-modal__control public-request-modal__control--select">
                <HiOutlineGlobeAlt aria-hidden="true" />
                <select
                  name="pais_id"
                  value={form.pais_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un pais</option>
                  {publicCountryOptions.map((country) => (
                    <option key={country.slug} value={country.id}>
                      {country.nombre}
                    </option>
                  ))}
                </select>
                <HiMiniChevronDown
                  className="public-request-modal__chevron"
                  aria-hidden="true"
                />
              </div>
            </label>
          ) : (
            <label className="public-request-modal__field">
              <span>Pais</span>
              <div className="public-request-modal__control public-request-modal__control--locked">
                <HiOutlineGlobeAlt aria-hidden="true" />
                <input type="text" value={countryLabel} readOnly />
              </div>
            </label>
          )}

          <label className="public-request-modal__field">
            <span>Correo</span>
            <div className="public-request-modal__control">
              <HiOutlineEnvelope aria-hidden="true" />
              <input
                type="email"
                name="correo"
                placeholder="tucorreo@ejemplo.com"
                value={form.correo}
                onChange={handleInputChange}
                required
              />
            </div>
          </label>

          <label className="public-request-modal__field">
            <span>Telefono</span>
            <div className="public-request-modal__control">
              <HiOutlinePhone aria-hidden="true" />
              <input
                type="tel"
                name="telefono"
                placeholder="+57 300 123 4567"
                value={form.telefono}
                onChange={handleInputChange}
                required
              />
            </div>
          </label>

          <label className="public-request-modal__field public-request-modal__field--full">
            <span>Finalidad</span>
            <div className="public-request-modal__control public-request-modal__control--select">
              <HiOutlineDocumentText aria-hidden="true" />
              <select
                name="finalidad"
                value={form.finalidad}
                onChange={handleInputChange}
                required
              >
                {PURPOSE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <HiMiniChevronDown
                className="public-request-modal__chevron"
                aria-hidden="true"
              />
            </div>
          </label>

          <label className="public-request-modal__field public-request-modal__field--full">
            <span>Mensaje</span>
            <div className="public-request-modal__control public-request-modal__control--textarea">
              <HiOutlineDocumentText aria-hidden="true" />
              <textarea
                name="mensaje"
                placeholder="Cuentanos como podemos ayudarte"
                value={form.mensaje}
                onChange={handleInputChange}
                rows={5}
              />
            </div>
          </label>

          {statusMessage ? (
            <p className={`public-request-modal__status public-request-modal__status--${statusTone}`}>
              {statusMessage}
            </p>
          ) : null}

          <div className="public-request-modal__actions">
            <button
              type="button"
              className="public-request-modal__secondary"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button type="submit" className="public-request-modal__primary" disabled={isSaving}>
              {isSaving ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PublicRequestModal
