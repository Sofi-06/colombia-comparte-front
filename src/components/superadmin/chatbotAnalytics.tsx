import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  HiOutlineChartBar,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineQuestionMarkCircle,
  HiOutlineUsers,
} from 'react-icons/hi2'
import { getChatbotAnalytics, type ChatbotAnalyticsResponse, type ChatbotAnalyticsRow } from '../../services/chatbotAnalytics'
import './chatbotAnalytics.css'

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

function formatDateLabel(value: string) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('es-CO', {
    month: 'short',
    day: 'numeric',
  })
}

function MetricTile(props: Readonly<{ title: string; value: number; icon: ReactNode; tone: string }>) {
  return (
    <article className={`chatbot-analytics__metric chatbot-analytics__metric--${props.tone}`}>
      <div className="chatbot-analytics__metric-icon">{props.icon}</div>
      <div>
        <p className="chatbot-analytics__metric-label">{props.title}</p>
        <strong className="chatbot-analytics__metric-value">{formatNumber(props.value)}</strong>
      </div>
    </article>
  )
}

export default function ChatbotAnalytics() {
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
            err instanceof Error ? err.message : 'No fue posible cargar las analíticas del chatbot.',
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

  const summary = useMemo(() => {
    const leads = data?.leads_por_pais ?? []
    const daily = data?.actividad_diaria ?? []
    const faqs = data?.faqs ?? []

    return {
      totalLeads: leads.reduce(
        (accumulator, item) =>
          accumulator +
          asNumber(firstPresent(item, ['sesiones_con_lead', 'leads_conversacion', 'leads'], '0')),
        0,
      ),
      totalMessages: daily.reduce(
        (accumulator, item) =>
          accumulator +
          asNumber(firstPresent(item, ['total_mensajes', 'mensajes', 'cantidad', 'total'], '0')),
        0,
      ),
      totalSessions: daily.reduce(
        (accumulator, item) =>
          accumulator +
          asNumber(firstPresent(item, ['sesiones_unicas', 'sesiones', 'total_sesiones'], '0')),
        0,
      ),
      totalFaqHits: faqs.reduce(
        (accumulator, item) =>
          accumulator + asNumber(firstPresent(item, ['veces', 'cantidad', 'total'], '0')),
        0,
      ),
    }
  }, [data])

  const leadsByCountry = useMemo(() => {
    const rows = (data?.leads_por_pais ?? []).map((item) => ({
      label: firstPresent(item, ['country', 'pais'], 'N/D'),
      sessions: asNumber(firstPresent(item, ['total_sesiones', 'total_leads', 'sesiones'], '0')),
      leads: asNumber(firstPresent(item, ['sesiones_con_lead', 'leads_conversacion', 'leads'], '0')),
      percentage: asNumber(firstPresent(item, ['pct_leads', 'porcentaje_leads'], '0')),
    }))

    const maxLeads = Math.max(1, ...rows.map((item) => item.leads))

    return rows.map((item) => ({
      ...item,
      width: `${Math.max(12, (item.leads / maxLeads) * 100)}%`,
    }))
  }, [data])

  const dailyActivity = useMemo(
    () =>
      (data?.actividad_diaria ?? []).map((item) => ({
        label: formatDateLabel(firstPresent(item, ['dia', 'fecha', 'day', 'date'], '')),
        messages: asNumber(firstPresent(item, ['total_mensajes', 'mensajes', 'cantidad', 'total'], '0')),
        sessions: asNumber(firstPresent(item, ['sesiones_unicas', 'sesiones', 'total_sesiones'], '0')),
      })),
    [data],
  )

  if (loading) {
    return <section className="chatbot-analytics">Cargando analíticas del chatbot...</section>
  }

  if (error) {
    return <section className="chatbot-analytics chatbot-analytics--error">{error}</section>
  }

  if (!data) {
    return null
  }

  return (
    <section className="chatbot-analytics">
      <div className="chatbot-analytics__hero">
        <div>
          <p className="chatbot-analytics__eyebrow">Chatbot Analytics</p>
          <h2>Comportamiento del asistente</h2>
          <p className="chatbot-analytics__subtitle">
            Resumen de leads, actividad diaria y desempeño general del chatbot de Colombia
            Comparte.
          </p>
        </div>
        <a className="chatbot-analytics__action" href="#/panel/chatbot/faqs">
          Ver preguntas frecuentes
        </a>
      </div>

      <div className="chatbot-analytics__metrics">
        <MetricTile
          title="Leads detectados"
          value={summary.totalLeads}
          icon={<HiOutlineChartBar />}
          tone="purple"
        />
        <MetricTile
          title="Mensajes totales"
          value={summary.totalMessages}
          icon={<HiOutlineChatBubbleBottomCenterText />}
          tone="blue"
        />
        <MetricTile
          title="Sesiones únicas"
          value={summary.totalSessions}
          icon={<HiOutlineUsers />}
          tone="pink"
        />
        <MetricTile
          title="FAQs registradas"
          value={summary.totalFaqHits}
          icon={<HiOutlineQuestionMarkCircle />}
          tone="mint"
        />
      </div>

      <div className="chatbot-analytics__grid">
        <section className="chatbot-analytics__panel">
          <div className="chatbot-analytics__panel-head">
            <h3>Leads por país</h3>
            <p>Sesiones y conversión a lead por país.</p>
          </div>

          <div className="chatbot-analytics__bars">
            {leadsByCountry.length ? (
              leadsByCountry.map((item) => (
                <article key={item.label} className="chatbot-analytics__bar-row">
                  <div className="chatbot-analytics__bar-meta">
                    <strong>{item.label}</strong>
                    <span>
                      {formatNumber(item.leads)} leads · {formatNumber(item.percentage)}%
                    </span>
                  </div>
                  <div className="chatbot-analytics__bar-track">
                    <div className="chatbot-analytics__bar-fill" style={{ width: item.width }} />
                  </div>
                </article>
              ))
            ) : (
              <p className="chatbot-analytics__empty">Sin datos de leads por país.</p>
            )}
          </div>
        </section>

        <section className="chatbot-analytics__panel">
          <div className="chatbot-analytics__panel-head">
            <h3>Actividad diaria</h3>
            <p>Mensajes y sesiones únicas en los últimos registros.</p>
          </div>

          <div className="chatbot-analytics__table-wrap">
            <table className="chatbot-analytics__table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Mensajes</th>
                  <th>Sesiones</th>
                </tr>
              </thead>
              <tbody>
                {dailyActivity.length ? (
                  dailyActivity.map((item, index) => (
                    <tr key={`${item.label}-${index}`}>
                      <td>{item.label}</td>
                      <td>{formatNumber(item.messages)}</td>
                      <td>{formatNumber(item.sessions)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Sin actividad registrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  )
}
