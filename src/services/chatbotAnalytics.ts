const CHATBOT_ANALYTICS_API_URL =
  import.meta.env.VITE_CHATBOT_ANALYTICS_API_URL?.trim() || 'http://127.0.0.1:8000/analytics'

export type ChatbotAnalyticsRow = Record<string, string | number | null | undefined>

export type ChatbotAnalyticsResponse = {
  leads_por_pais: ChatbotAnalyticsRow[]
  actividad_diaria: ChatbotAnalyticsRow[]
  faqs: ChatbotAnalyticsRow[]
}

export async function getChatbotAnalytics(): Promise<ChatbotAnalyticsResponse> {
  const res = await fetch(CHATBOT_ANALYTICS_API_URL, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('No fue posible cargar las analíticas del chatbot.')
  }

  const payload = (await res.json()) as Partial<ChatbotAnalyticsResponse>

  return {
    leads_por_pais: Array.isArray(payload.leads_por_pais) ? payload.leads_por_pais : [],
    actividad_diaria: Array.isArray(payload.actividad_diaria) ? payload.actividad_diaria : [],
    faqs: Array.isArray(payload.faqs) ? payload.faqs : [],
  }
}
