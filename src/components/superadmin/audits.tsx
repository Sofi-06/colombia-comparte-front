import { useEffect, useMemo, useState } from 'react'
import { getAudits, type AuditRecord } from '../../services/audits'
import './audits.css'

const PAGE_SIZE = 4

function formatAuditDate(value?: string) {
  if (!value) {
    return 'Sin fecha'
  }

  return new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function formatAuditUser(log: AuditRecord) {
  const fullName = [log.usuarios?.nombre, log.usuarios?.apellido].filter(Boolean).join(' ').trim()
  return fullName || log.usuarios?.email || 'Sistema'
}

function formatAuditAction(value?: string) {
  if (!value) {
    return 'Sin acción'
  }

  return value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ')
}

function formatAuditModule(value?: string) {
  if (!value) {
    return 'General'
  }

  return value[0]?.toUpperCase() + value.slice(1)
}

function getActionTone(action?: string) {
  if (!action) {
    return 'audit-badge--neutral'
  }

  if (action.includes('ELIMINAR') || action.includes('BORRAR')) {
    return 'audit-badge--danger'
  }

  if (action.includes('CREAR') || action.includes('REGISTRAR')) {
    return 'audit-badge--success'
  }

  if (action.includes('INICIO_SESION')) {
    return 'audit-badge--info'
  }

  return 'audit-badge--neutral'
}

function AuditList() {
  const [logs, setLogs] = useState<AuditRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const load = async () => {
      const isFirstLoad = page === 1 && logs.length === 0

      if (isFirstLoad) {
        setIsLoading(true)
      } else {
        setIsPageLoading(true)
      }

      setError('')

      try {
        const offset = (page - 1) * PAGE_SIZE
        const response = await getAudits(PAGE_SIZE, offset)
        setLogs(response.audits)
        setTotal(response.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar auditoría.')
      } finally {
        setIsLoading(false)
        setIsPageLoading(false)
      }
    }

    void load()
  }, [page])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total])
  const startRecord = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const endRecord = total === 0 ? 0 : Math.min(page * PAGE_SIZE, total)

  return (
    <section className="audit-card">
      <div className="audit-card__hero">
        <div>
          <p className="audit-card__eyebrow">Bitácora del sistema</p>
          <h2>Auditoría reciente</h2>
          <p className="audit-card__subtitle">
            Revisa actividad de usuarios, accesos y cambios hechos en la plataforma.
          </p>
        </div>

        <div className="audit-card__summary">
          <span className="audit-card__summary-label">Registros</span>
          <strong>{total}</strong>
          <small>
            {startRecord}-{endRecord} de {total}
          </small>
        </div>
      </div>

      {isLoading ? (
        <p className="audit-state">Cargando registros de auditoría...</p>
      ) : error ? (
        <p className="audit-error">{error}</p>
      ) : (
        <>
          <div className="audit-list">
            {logs.map((log) => (
              <article className="audit-entry" key={log.id ?? `${log.created_at}-${log.usuario_id}`}>
                <div className="audit-entry__main">
                  <div className="audit-field">
                    <span className="audit-field__label">Fecha</span>
                    <span className="audit-row__date">{formatAuditDate(log.created_at)}</span>
                  </div>

                  <div className="audit-field">
                    <span className="audit-field__label">Usuario</span>
                    <span className="audit-row__user">{formatAuditUser(log)}</span>
                  </div>

                  <div className="audit-field">
                    <span className="audit-field__label">IP</span>
                    <span className="audit-row__ip">{log.ip ?? 'Sin IP'}</span>
                  </div>

                  <div className="audit-field">
                    <span className="audit-field__label">Acción</span>
                    <span className={`audit-badge ${getActionTone(log.action)}`}>
                      {formatAuditAction(log.action)}
                    </span>
                  </div>

                  <div className="audit-field">
                    <span className="audit-field__label">Módulo</span>
                    <span className="audit-row__module">{formatAuditModule(log.module)}</span>
                  </div>
                </div>

                <div className="audit-entry__description">
                  <span className="audit-field__label">Descripción</span>
                  <span className="audit-row__description">{log.description ?? 'Sin descripción'}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="audit-pagination">
            <div className="audit-pagination__meta">
              {isPageLoading ? 'Actualizando página...' : `Página ${page} de ${totalPages}`}
            </div>

            <div className="audit-pagination__actions">
              <button
                type="button"
                className="audit-pagination__button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1 || isPageLoading}
              >
                Anterior
              </button>

              <button
                type="button"
                className="audit-pagination__button audit-pagination__button--primary"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages || isPageLoading}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default AuditList
