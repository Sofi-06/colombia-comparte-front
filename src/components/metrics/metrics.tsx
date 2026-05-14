import { useEffect, useState } from 'react'
import { getMetrics, type MetricsRecord } from '../../services/metrics'
import './metrics.css'
import {
  HiOutlineUserGroup,
  HiOutlineNewspaper,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEnvelope,
  HiOutlineDocumentText,
} from 'react-icons/hi2'

const METRIC_ITEMS: { key: keyof MetricsRecord; title: string; icon: JSX.Element }[] = [
  { key: 'users', title: 'Usuarios', icon: <HiOutlineUserGroup /> },
  { key: 'news', title: 'Noticias (tot)', icon: <HiOutlineNewspaper /> },
  { key: 'news_published', title: 'Noticias (public.)', icon: <HiOutlineNewspaper /> },
  { key: 'testimonials', title: 'Testimonios', icon: <HiOutlineChatBubbleLeftRight /> },
  { key: 'requests', title: 'Solicitudes', icon: <HiOutlineEnvelope /> },
  { key: 'requests_pending', title: 'Solicitudes (pend.)', icon: <HiOutlineDocumentText /> },
]

function MetricCard(props: Readonly<{ title: string; value: number; icon: string; variant: number }>) {
  return (
    <div className={`metrics-card metrics-card--${props.variant}`}>
      <div className="metrics-card__media">{props.icon}</div>
      <div className="metrics-card__body">
        <div className="metrics-card__title">{props.title}</div>
        <div className="metrics-card__value">{props.value}</div>
      </div>
    </div>
  )
}

export default function Metrics() {
  const [metrics, setMetrics] = useState<MetricsRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        const data = await getMetrics()
        if (mounted) setMetrics(data)
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Error')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void load()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div className="metrics">Cargando métricas...</div>
  if (error) return <div className="metrics">{error}</div>
  if (!metrics) return null

  return (
    <section className="metrics metrics--cards">
      {METRIC_ITEMS.map((item, idx) => (
        <MetricCard
          key={String(item.key)}
          title={item.title}
          value={Number(metrics[item.key] ?? 0)}
          icon={item.icon}
          variant={idx + 1}
        />
      ))}
    </section>
  )
}
