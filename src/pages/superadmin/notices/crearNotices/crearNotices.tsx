import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  HiMiniChevronDown,
  HiOutlineArrowUpTray,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineNewspaper,
  HiOutlinePencilSquare,
} from 'react-icons/hi2'
import NavbarTwo from '../../../../components/navbar2/navbartwo'
import { getStoredAuthUser, isSuperadmin } from '../../../../services/auth'
import { getActiveCountries, type CountryRecord } from '../../../../services/countries'
import { createNews, type NewsPayload } from '../../../../services/news'
import '../notices.css'
import './crearNotices.css'

type FormState = {
  titulo: string
  resumen: string
  contenido: string
  imagen_principal_url: string
  estado: NewsPayload['estado']
  pais_id: string
}

const INITIAL_FORM: FormState = {
  titulo: '',
  resumen: '',
  contenido: '',
  imagen_principal_url: '',
  estado: 'borrador',
  pais_id: '',
}

function toPayload(form: FormState): NewsPayload {
  return {
    titulo: form.titulo.trim(),
    resumen: form.resumen.trim(),
    contenido: form.contenido.trim(),
    imagen_principal_url: form.imagen_principal_url.trim(),
    estado: form.estado,
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

      reject(new Error('No fue posible leer la imagen seleccionada.'))
    }

    reader.onerror = () => reject(new Error('No fue posible leer la imagen seleccionada.'))
    reader.readAsDataURL(file)
  })
}

function CrearNoticesPage() {
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
  const [selectedImageName, setSelectedImageName] = useState('')

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const records = await getActiveCountries()
        setCountries(records)
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : 'No fue posible cargar los países.',
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

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setSelectedImageName('')
      setForm((current) => ({ ...current, imagen_principal_url: '' }))
      return
    }

    try {
      const imageAsDataUrl = await readFileAsDataUrl(file)
      setSelectedImageName(file.name)
      setForm((current) => ({ ...current, imagen_principal_url: imageAsDataUrl }))
      setStatusMessage('')
      setStatusTone('')
    } catch (error) {
      setSelectedImageName('')
      setForm((current) => ({ ...current, imagen_principal_url: '' }))
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible cargar la imagen.',
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
      setStatusMessage('Selecciona el país donde se debe publicar la noticia.')
      setStatusTone('error')
      setIsSaving(false)
      return
    }

    try {
      await createNews(toPayload(form))
      setStatusMessage('Noticia creada correctamente.')
      setStatusTone('success')
      globalThis.setTimeout(() => {
        globalThis.location.hash = '#/panel/noticias'
      }, 900)
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible crear la noticia.',
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
        aria-label="Crear noticia"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="noticias"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="notice-form-page">
          <article className="notice-form-card">
            <div className="notice-form-card__header">
              <div>
                <h1>Crear noticia</h1>
                <p>Asigna el país correcto para que la publicación salga en ese portal.</p>
              </div>
              <a href="#/panel/noticias">Volver al listado</a>
            </div>

            <form className="notice-form-grid" onSubmit={handleSubmit}>
              <label className="notice-form-field">
                <span>Título</span>
                <div className="notice-form-control">
                  <HiOutlineNewspaper aria-hidden="true" />
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Nueva noticia"
                    value={form.titulo}
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

              <label className="notice-form-field notice-form-field--full">
                <span>Resumen</span>
                <div className="notice-form-control notice-form-control--textarea">
                  <HiOutlineDocumentText aria-hidden="true" />
                  <textarea
                    name="resumen"
                    placeholder="Resumen corto de la noticia"
                    value={form.resumen}
                    onChange={handleInputChange}
                    rows={3}
                    maxLength={400}
                    required
                  />
                </div>
              </label>

              <label className="notice-form-field notice-form-field--full">
                <span>Contenido</span>
                <div className="notice-form-control notice-form-control--textarea">
                  <HiOutlineDocumentText aria-hidden="true" />
                  <textarea
                    name="contenido"
                    placeholder="Contenido completo de la noticia"
                    value={form.contenido}
                    onChange={handleInputChange}
                    rows={8}
                    required
                  />
                </div>
              </label>

              <label className="notice-form-field">
                <span>Imagen principal</span>
                <div className="notice-form-control">
                  <HiOutlineArrowUpTray aria-hidden="true" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => void handleImageChange(event)}
                    required
                  />
                </div>
                <p className="notice-form-help">
                  {selectedImageName || 'Selecciona una imagen desde tu equipo para la portada.'}
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
                    Esta noticia se publicará en el portal del país asignado a tu cuenta.
                  </p>
                ) : null}
              </label>

              {statusMessage ? (
                <p className={`notice-form-status notice-form-status--${statusTone}`}>
                  {statusMessage}
                </p>
              ) : null}

              <div className="notice-form-actions">
                <a href="#/panel/noticias">Cancelar</a>
                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Creando...' : 'Guardar noticia'}
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>
    </main>
  )
}

export default CrearNoticesPage
