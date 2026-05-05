import { useState } from 'react'
import Banner from '../../components/banner/banner'
import NavbarTwo from '../../components/navbar2/navbartwo'
import './superadmin.css'

function Superadmin() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  return (
    <main className="superadmin-page">
      <div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
      <div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

      <section
        className="superadmin-shell"
        aria-label="Panel principal"
        style={{ ['--sidebar-width' as string]: isNavCollapsed ? '5.5rem' : '16rem' }}
      >
        <NavbarTwo
          activeItem="dashboard"
          collapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed((current) => !current)}
        />

        <div className="superadmin-content">
          <Banner />

          <section className="superadmin-card">
            <p className="superadmin-card__note">
              Este espacio queda listo para mostrar metricas, accesos y controles
              segun el rol con el que iniciaste sesion.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Superadmin
