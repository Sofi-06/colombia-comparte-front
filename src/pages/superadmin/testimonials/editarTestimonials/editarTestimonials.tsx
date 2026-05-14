import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  HiMiniChevronDown,
  HiOutlineArrowUpTray,
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
  HiOutlinePencilSquare,
} from 'react-icons/hi2'
import NavbarTwo from '../../../../components/navbar2/navbartwo'
import { getStoredAuthUser, isSuperadmin } from '../../../../services/auth'
import { getActiveCountries, type CountryRecord } from '../../../../services/countries'
import {
  getTestimonialById,
  updateTestimonial,
  type TestimonialPayload,
} from '../../../../services/testimonials'
import '../../notices/notices.css'
import './editarTestimonials.css'

type FormState = {
  nombre: string
  cargo: string
  empresa: string
  contenido: string
  foto_url: string
  video_url: string
  instagram_url: string
  facebook_url: string
  estado: TestimonialPayload['estado']
  destacado: boolean
  pais_id: string
}

const INITIAL_FORM: FormState = {
  nombre: '',
  cargo: '',
  empresa: '',
  contenido: '',
  foto_url: '',
  video_url: '',
  instagram_url: '',
  facebook_url: '',
  estado: 'borrador',
  destacado: false,
  pais_id: '',
}

function getTestimonialIdFromHash() {
  const segments = globalThis.location.hash.split('/')
  return segments[segments.length - 1] ?? ''
}

function toPayload(form: FormState): TestimonialPayload {
  return {
    nombre: form.nombre.trim(),
    cargo: form.cargo.trim(),
    empresa: form.empresa.trim(),
    contenido: form.contenido.trim(),
    foto_url: form.foto_url.trim(),
    video_url: form.video_url.trim() || undefined,
    instagram_url: form.instagram_url.trim(),
    facebook_url: form.facebook_url.trim(),
    estado: form.estado,
    destacado: form.destacado,
    pais_id: Number(form.pais_id),
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('No fue posible leer la foto seleccionada.'))
    }

    reader.onerror = () => reject(new Error('No fue posible leer la foto seleccionada.'))
    reader.readAsDataURL(file)
  })
}

function EditarTestimonialsPage() {
  const testimonialId = useMemo(getTestimonialIdFromHash, [])
  const authUser = useMemo(getStoredAuthUser, [])
  const canChooseCountry = isSuperadmin(authUser)
  const lockedCountryId = authUser?.pais_id != null ? String(authUser.pais_id) : ''
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [countries, setCountries] = useState<CountryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')
  const [selectedImageName, setSelectedImageName] = useState('')

  useEffect(() => {
    const loadTestimonial = async () => {
      setIsLoading(true)

      try {
        const [countryRecords, selectedTestimonial] = await Promise.all([
          getActiveCountries(),
          getTestimonialById(testimonialId),
        ])

        setCountries(countryRecords)

        if (!selectedTestimonial) {
          setStatusMessage('No encontramos el testimonio que intentas editar.')
          setStatusTone('error')
          return
        }

        const resolvedCountryId =
          selectedTestimonial.pais_id != null
            ? String(selectedTestimonial.pais_id)
            : lockedCountryId

        setForm({
          nombre: selectedTestimonial.nombre ?? '',
          cargo: selectedTestimonial.cargo ?? '',
          empresa: selectedTestimonial.empresa ?? '',
          contenido: selectedTestimonial.contenido ?? '',
          foto_url: selectedTestimonial.foto_url ?? '',
          video_url: selectedTestimonial.video_url ?? '',
          instagram_url: selectedTestimonial.instagram_url ?? '',
          facebook_url: selectedTestimonial.facebook_url ?? '',
          estado:
            selectedTestimonial.estado === 'publicado' ||
            selectedTestimonial.estado === 'despublicado'
              ? selectedTestimonial.estado
              : 'borrador',
          destacado: Boolean(selectedTestimonial.destacado),
          pais_id: canChooseCountry ? resolvedCountryId : lockedCountryId || resolvedCountryId,
        })
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : 'No fue posible cargar el testimonio.',
        )
        setStatusTone('error')
      } finally {
        setIsLoading(false)
      }
    }

    void loadTestimonial()
  }, [canChooseCountry, lockedCountryId, testimonialId])

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setForm((current) => ({ ...current, [name]: checked }))
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    // validate type and size (max 5MB)
    if (!file.type.startsWith('image/')) {
      setStatusMessage('El archivo debe ser una imagen válida.')
      setStatusTone('error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage('La imagen debe ser menor a 5 MB.')
      setStatusTone('error')
      return
    }

    try {
      const imageAsDataUrl = await readFileAsDataUrl(file)
      setSelectedImageName(file.name)
      setForm((current) => ({ ...current, foto_url: imageAsDataUrl }))
      setStatusMessage('')
      setStatusTone('')
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible cargar la foto.',
      )
      setStatusTone('error')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setStatusMessage('')
    setStatusTone('')

    if (!form.pais_id) {
      setStatusMessage('Selecciona el país donde se debe publicar el testimonio.')
      setStatusTone('error')
      setIsSaving(false)
      return
    }

    try {
      await updateTestimonial(testimonialId, toPayload(form))
      setStatusMessage('Testimonio actualizado correctamente.')
      setStatusTone('success')
      globalThis.setTimeout(() => {
        globalThis.location.hash = '#/panel/testimonios'
      }, 900)
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible actualizar el testimonio.',
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
        aria-label="Editar testimonio"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="testimonios"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="notice-form-page">
          <article className="notice-form-card">
            <div className="notice-form-card__header">
              <div>
                <h1>Editar testimonio</h1>
                <p>Actualiza la historia y confirma el país antes de guardar.</p>
              </div>
              <a href="#/panel/testimonios">Volver al listado</a>
            </div>

            {isLoading ? (
              <p className="notice-form-loading">Cargando informacion del testimonio...</p>
            ) : (
              <form className="notice-form-grid" onSubmit={handleSubmit}>
                <label className="notice-form-field">
                  <span>Nombre</span>
                  <div className="notice-form-control">
                    <HiOutlineIdentification aria-hidden="true" />
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre de la persona"
                      value={form.nombre}
                      onChange={handleInputChange}
                      maxLength={180}
                      required
                    />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Estado</span>
                  <div className="notice-form-control notice-form-control--select">
                    <HiOutlinePencilSquare aria-hidden="true" />
                    <select name="estado" value={form.estado} onChange={handleInputChange} required>
                      <option value="borrador">Borrador</option>
                      <option value="publicado">Publicado</option>
                      <option value="despublicado">Despublicado</option>
                    </select>
                    <HiMiniChevronDown className="notice-form-control__chevron" aria-hidden="true" />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Cargo</span>
                  <div className="notice-form-control">
                    <HiOutlineIdentification aria-hidden="true" />
                    <input
                      type="text"
                      name="cargo"
                      placeholder="Cargo o rol"
                      value={form.cargo}
                      onChange={handleInputChange}
                      maxLength={180}
                    />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Empresa</span>
                  <div className="notice-form-control">
                    <HiOutlineChatBubbleLeftRight aria-hidden="true" />
                    <input
                      type="text"
                      name="empresa"
                      placeholder="Empresa u organizacion"
                      value={form.empresa}
                      onChange={handleInputChange}
                      maxLength={180}
                    />
                  </div>
                </label>

                <label className="notice-form-field notice-form-field--full">
                  <span>Contenido</span>
                  <div className="notice-form-control notice-form-control--textarea">
                    <HiOutlineDocumentText aria-hidden="true" />
                    <textarea
                      name="contenido"
                      placeholder="Escribe el testimonio completo"
                      value={form.contenido}
                      onChange={handleInputChange}
                      rows={8}
                      required
                    />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Foto</span>
                  <div className="notice-form-control">
                    <HiOutlineArrowUpTray aria-hidden="true" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handleImageChange(event)}
                      required={!form.foto_url}
                    />
                  </div>
                  <p className="notice-form-help">
                    {selectedImageName ||
                      (form.foto_url
                        ? 'El testimonio ya tiene una foto guardada. Puedes reemplazarla con otro archivo.'
                        : 'Selecciona una foto desde tu equipo para el testimonio.')}
                  </p>
                </label>

                <label className="notice-form-field">
                  <span>País</span>
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
                        {canChooseCountry ? 'Selecciona un país' : 'País asignado por tu rol'}
                      </option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.nombre}
                        </option>
                      ))}
                    </select>
                    <HiMiniChevronDown className="notice-form-control__chevron" aria-hidden="true" />
                  </div>
                  {!canChooseCountry ? (
                    <p className="notice-form-help">
                      Tu rol publica testimonios únicamente en su país asignado.
                    </p>
                  ) : null}
                </label>

                <label className="notice-form-field">
                  <span>Instagram</span>
                  <div className="notice-form-control">
                    <HiOutlineChatBubbleLeftRight aria-hidden="true" />
                    <input
                      type="url"
                      name="instagram_url"
                      placeholder="https://instagram.com/..."
                      value={form.instagram_url}
                      onChange={handleInputChange}
                    />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Video (YouTube)</span>
                  <div className="notice-form-control">
                    <HiOutlineChatBubbleLeftRight aria-hidden="true" />
                    <input
                      type="url"
                      name="video_url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={form.video_url}
                      onChange={handleInputChange}
                    />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Facebook</span>
                  <div className="notice-form-control">
                    <HiOutlineChatBubbleLeftRight aria-hidden="true" />
                    <input
                      type="url"
                      name="facebook_url"
                      placeholder="https://facebook.com/..."
                      value={form.facebook_url}
                      onChange={handleInputChange}
                    />
                  </div>
                </label>

                <label className="testimonial-form-toggle notice-form-field--full">
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={form.destacado}
                    onChange={handleCheckboxChange}
                  />
                  <span>Marcar como testimonio destacado</span>
                </label>

                {statusMessage ? (
                  <p className={`notice-form-status notice-form-status--${statusTone}`}>
                    {statusMessage}
                  </p>
                ) : null}

                <div className="notice-form-actions">
                  <a href="#/panel/testimonios">Cancelar</a>
                  <button type="submit" disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Actualizar testimonio'}
                  </button>
                </div>
              </form>
            )}
          </article>
        </div>
      </section>
    </main>
  )
}

export default EditarTestimonialsPage
