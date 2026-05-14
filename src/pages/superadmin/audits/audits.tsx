import { useState } from 'react'
import NavbarTwo from '../../../components/navbar2/navbartwo'
import AuditList from '../../../components/superadmin/audits'
import './audits.css'

function AuditsPage() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Auditoría"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="auditoria"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="superadmin-content">
          <section className="superadmin-card">
            <AuditList />
          </section>
        </div>
      </section>
    </main>
  )
}

export default AuditsPage
