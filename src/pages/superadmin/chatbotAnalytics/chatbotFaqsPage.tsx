import { useEffect, useMemo, useState } from 'react'
import NavbarTwo from '../../../components/navbar2/navbartwo'
import {
  getChatbotAnalytics,
  type ChatbotAnalyticsResponse,
  type ChatbotAnalyticsRow,
} from '../../../services/chatbotAnalytics'
import '../superadmin.css'
import '../../../components/superadmin/chatbotAnalytics.css'

function firstPresent(item: ChatbotAnalyticsRow, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = item[key]
    if (value !== undefined && value !== null && value !== '') {
      return String(value)
    }
  }

  return fallback
}

function asNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(value)
}

function formatTimestamp(value: string) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function ChatbotFaqsPage() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [data, setData] = useState<ChatbotAnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getChatbotAnalytics()
        if (mounted) {
          setData(response)
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : 'No fue posible cargar las preguntas frecuentes.',
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      mounted = false
    }
  }, [])

  const topFaqs = useMemo(
    () =>
      (data?.faqs ?? []).map((item) => ({
        question: firstPresent(item, ['pregunta', 'faq', 'query'], 'N/D'),
        count: asNumber(firstPresent(item, ['veces', 'cantidad', 'total'], '0')),
        lastSeen: formatTimestamp(
          firstPresent(item, ['ultima_vez', 'last_seen', 'updated_at'], 'N/D'),
        ),
      })),
    [data],
  )

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Preguntas frecuentes del chatbot"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="chatbot"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="superadmin-content">
          <section className="superadmin-card">
            <section className="chatbot-analytics">
              <div className="chatbot-analytics__hero">
                <div>
                  <p className="chatbot-analytics__eyebrow">Chatbot Analytics</p>
                  <h2>Preguntas frecuentes</h2>
                  <p className="chatbot-analytics__subtitle">
                    Consultas más repetidas detectadas en el chatbot de Colombia Comparte.
                  </p>
                </div>
                <a className="chatbot-analytics__action" href="#/panel/chatbot">
                  Volver al resumen
                </a>
              </div>

              {loading ? <p>Cargando preguntas frecuentes...</p> : null}
              {error ? <section className="chatbot-analytics chatbot-analytics--error">{error}</section> : null}

              {!loading && !error ? (
                <section className="chatbot-analytics__panel">
                  <div className="chatbot-analytics__table-wrap">
                    <table className="chatbot-analytics__table">
                      <thead>
                        <tr>
                          <th>Pregunta</th>
                          <th>Veces</th>
                          <th>Última vez</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topFaqs.length ? (
                          topFaqs.map((item, index) => (
                            <tr key={`${item.question}-${index}`}>
                              <td>{item.question}</td>
                              <td>{formatNumber(item.count)}</td>
                              <td>{item.lastSeen}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3}>Sin preguntas frecuentes registradas.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}
            </section>
          </section>
        </div>
      </section>
    </main>
  )
}

export default ChatbotFaqsPage
