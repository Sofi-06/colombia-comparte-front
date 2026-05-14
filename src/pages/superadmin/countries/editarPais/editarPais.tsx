import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  HiMiniChevronDown,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
} from 'react-icons/hi2'
import NavbarTwo from '../../../../components/navbar2/navbartwo'
import { getStoredAuthUser, isSuperadmin } from '../../../../services/auth'
import { getCountryById, updateCountry } from '../../../../services/countries'
import '../../notices/notices.css'
import './editarPais.css'

type FormState = {
  nombre: string
  codigo: string
  slug: string
  estado: string
}

const INITIAL_FORM: FormState = {
  nombre: '',
  codigo: '',
  slug: '',
  estado: 'activo',
}

function getCountryIdFromHash() {
  const segments = globalThis.location.hash.split('/')
  return segments[segments.length - 1] ?? ''
}

function EditarPaisPage() {
  const countryId = useMemo(getCountryIdFromHash, [])
  const authUser = useMemo(getStoredAuthUser, [])
  const canAccess = isSuperadmin(authUser)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error' | ''>('')

  useEffect(() => {
    if (!canAccess) {
      globalThis.location.replace('#/panel')
      return
    }

    const loadCountry = async () => {
      setIsLoading(true)

      try {
        const country = await getCountryById(countryId)

        if (!country) {
          setStatusMessage('No encontramos el pais que intentas editar.')
          setStatusTone('error')
          return
        }

        setForm({
          nombre: country.nombre ?? '',
          codigo: country.codigo ?? '',
          slug: country.slug ?? '',
          estado: country.estado ?? 'activo',
        })
      } catch (error) {
        setStatusMessage(
          error instanceof Error ? error.message : 'No fue posible cargar el pais.',
        )
        setStatusTone('error')
      } finally {
        setIsLoading(false)
      }
    }

    void loadCountry()
  }, [canAccess, countryId])

  if (!canAccess) {
    return null
  }

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setStatusMessage('')
    setStatusTone('')

    try {
      await updateCountry(countryId, {
        nombre: form.nombre.trim(),
        codigo: form.codigo.trim().toUpperCase(),
        slug: form.slug.trim().toLowerCase(),
        estado: form.estado,
      })
      setStatusMessage('Pais actualizado correctamente.')
      setStatusTone('success')
      globalThis.setTimeout(() => {
        globalThis.location.hash = '#/panel/paises'
      }, 900)
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : 'No fue posible actualizar el pais.',
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
        aria-label="Editar pais"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="paises"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="notice-form-page">
          <article className="notice-form-card">
            <div className="notice-form-card__header">
              <div>
                <h1>Editar pais</h1>
                <p>Actualiza nombre, codigo, slug y estado antes de guardar cambios.</p>
              </div>
              <a href="#/panel/paises">Volver al listado</a>
            </div>

            {isLoading ? (
              <p className="notice-form-loading">Cargando informacion del pais...</p>
            ) : (
              <form className="notice-form-grid" onSubmit={handleSubmit}>
                <label className="notice-form-field">
                  <span>Nombre</span>
                  <div className="notice-form-control">
                    <HiOutlineIdentification aria-hidden="true" />
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre del pais"
                      value={form.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Codigo</span>
                  <div className="notice-form-control">
                    <HiOutlineGlobeAlt aria-hidden="true" />
                    <input
                      type="text"
                      name="codigo"
                      placeholder="CO"
                      maxLength={3}
                      value={form.codigo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Slug</span>
                  <div className="notice-form-control">
                    <HiOutlineGlobeAlt aria-hidden="true" />
                    <input
                      type="text"
                      name="slug"
                      placeholder="colombia"
                      value={form.slug}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </label>

                <label className="notice-form-field">
                  <span>Estado</span>
                  <div className="notice-form-control notice-form-control--select">
                    <HiOutlineGlobeAlt aria-hidden="true" />
                    <select name="estado" value={form.estado} onChange={handleInputChange} required>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                    <HiMiniChevronDown className="notice-form-control__chevron" aria-hidden="true" />
                  </div>
                </label>

                {statusMessage ? (
                  <p className={`notice-form-status notice-form-status--${statusTone}`}>
                    {statusMessage}
                  </p>
                ) : null}

                <div className="notice-form-actions">
                  <a href="#/panel/paises">Cancelar</a>
                  <button type="submit" disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Actualizar pais'}
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

export default EditarPaisPage
