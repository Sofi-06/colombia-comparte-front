import { useState } from 'react'
import NavbarTwo from '../../../components/navbar2/navbartwo'
import ChatbotAnalytics from '../../../components/superadmin/chatbotAnalytics'
import '../superadmin.css'

function ChatbotAnalyticsPage() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Analiticas del chatbot"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="chatbot"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="superadmin-content">
          <section className="superadmin-card">
            <ChatbotAnalytics />
          </section>
        </div>
      </section>
    </main>
  )
}

export default ChatbotAnalyticsPage
