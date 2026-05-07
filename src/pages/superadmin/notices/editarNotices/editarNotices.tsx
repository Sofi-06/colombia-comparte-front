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
import { getNewsById, updateNews, type NewsPayload } from '../../../../services/news'
import '../notices.css'
import './editarNotices.css'

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

function getNoticeIdFromHash() {
  const segments = globalThis.location.hash.split('/')
  return segments[segments.length - 1] ?? ''
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

function EditarNoticesPage() {
  const noticeId = useMemo(getNoticeIdFromHash, [])
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
    const loadNotice = async () => {
      setIsLoading(true)

      try {
        const [countryRecords, selectedNotice] = await Promise.all([
          getActiveCountries(),
          getNewsById(noticeId),
        ])

        setCountries(countryRecords)

        if (!selectedNotice) {
          setStatusMessage('No encontramos la noticia que intentas editar.')
          setStatusTone('error')
          return
        }

        const resolvedCountryId =
          selectedNotice.pais_id != null ? String(selectedNotice.pais_id) : lockedCountryId

        setForm({
          titulo: selectedNotice.titulo ?? '',
          resumen: selectedNotice.resumen ?? '',
          contenido: selectedNotice.contenido ?? '',
          imagen_principal_url: selectedNotice.imagen_principal_url ?? '',
          estado:
            selectedNotice.estado === 'publicado' || selectedNotice.estado === 'despublicado'
              ? selectedNotice.estado
              : 'borrador',
          pais_id: canChooseCountry ? resolvedCountryId : lockedCountryId || resolvedCountryId,
        })
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : 'No fue posible cargar la noticia.',
        )
        setStatusTone('error')
      } finally {
        setIsLoading(false)
      }
    }

    void loadNotice()
  }, [canChooseCountry, lockedCountryId, noticeId])

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const imageAsDataUrl = await readFileAsDataUrl(file)
      setSelectedImageName(file.name)
      setForm((current) => ({ ...current, imagen_principal_url: imageAsDataUrl }))
      setStatusMessage('')
      setStatusTone('')
    } catch (error) {
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
      setStatusMessage('Selecciona el pais donde se debe publicar la noticia.')
      setStatusTone('error')
      setIsSaving(false)
      return
    }

    try {
      await updateNews(noticeId, toPayload(form))
      setStatusMessage('Noticia actualizada correctamente.')
      setStatusTone('success')
      globalThis.setTimeout(() => {
        globalThis.location.hash = '#/superadmin/noticias'
      }, 900)
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible actualizar la noticia.',
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
        aria-label="Editar noticia"
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
                <h1>Editar noticia</h1>
                <p>Ajusta el contenido y confirma el pais de publicacion antes de guardar.</p>
              </div>
              <a href="#/superadmin/noticias">Volver al listado</a>
            </div>

            {isLoading ? (
              <p className="notice-form-loading">Cargando informacion de la noticia...</p>
            ) : (
              <form className="notice-form-grid" onSubmit={handleSubmit}>
                <label className="notice-form-field">
                  <span>Titulo</span>
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
                      required={!form.imagen_principal_url}
                    />
                  </div>
                  <p className="notice-form-help">
                    {selectedImageName ||
                      (form.imagen_principal_url
                        ? 'La noticia ya tiene una imagen guardada. Puedes reemplazarla con otro archivo.'
                        : 'Selecciona una imagen desde tu equipo para la portada.')}
                  </p>
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
                  {!canChooseCountry ? (
                    <p className="notice-form-help">
                      Tu rol publica noticias unicamente en su pais asignado.
                    </p>
                  ) : null}
                </label>

                {statusMessage ? (
                  <p className={`notice-form-status notice-form-status--${statusTone}`}>
                    {statusMessage}
                  </p>
                ) : null}

                <div className="notice-form-actions">
                  <a href="#/superadmin/noticias">Cancelar</a>
                  <button type="submit" disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Actualizar noticia'}
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

export default EditarNoticesPage
