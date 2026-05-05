import {
  HiOutlineBars3CenterLeft,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineNewspaper,
  HiOutlinePower,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
} from 'react-icons/hi2'
import logo from '../../assets/colombia-comparte.png'
import './navbartwo.css'

type NavbarTwoProps = {
  activeItem?: 'dashboard' | 'usuarios' | 'noticias' | 'testimonios'
  collapsed?: boolean
  onToggleCollapse?: () => void
}

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '#/superadmin',
    icon: HiOutlineSquares2X2,
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    href: '#/superadmin/usuarios',
    icon: HiOutlineUserGroup,
  },
  {
    id: 'noticias',
    label: 'Noticias',
    href: '#/noticias',
    icon: HiOutlineNewspaper,
  },
  {
    id: 'testimonios',
    label: 'Testimonios',
    href: '#/superadmin#testimonios',
    icon: HiOutlineChatBubbleLeftRight,
  },
] as const

function NavbarTwo({
  activeItem = 'dashboard',
  collapsed = false,
  onToggleCollapse,
}: NavbarTwoProps) {
  const handleLogout = () => {
    globalThis.localStorage.removeItem('authToken')
    globalThis.localStorage.removeItem('authUser')
    globalThis.location.replace('#/login')
  }

  return (
    <aside
      className={`navbar-two ${collapsed ? 'navbar-two--collapsed' : ''}`}
      aria-label="Navegacion del dashboard"
    >
      <div className="navbar-two__topbar">
        <button
          className="navbar-two__toggle"
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
          aria-pressed={collapsed}
        >
          {collapsed ? (
            <HiOutlineBars3CenterLeft className="navbar-two__toggle-icon" aria-hidden="true" />
          ) : (
            <HiOutlineChevronDoubleLeft className="navbar-two__toggle-icon" aria-hidden="true" />
          )}
        </button>
      </div>

      <a className="navbar-two__brand" href="#/">
        <img className="navbar-two__logo" src={logo} alt="" />
        <div className="navbar-two__brand-copy">
          <span className="navbar-two__brand-title">Colombia</span>
          <span className="navbar-two__brand-subtitle">Comparte</span>
        </div>
      </a>

      <nav className="navbar-two__nav">
        <ul className="navbar-two__menu">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeItem

            return (
              <li key={item.id}>
                <a
                  className={`navbar-two__link ${
                    isActive ? 'navbar-two__link--active' : ''
                  }`}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="navbar-two__icon" aria-hidden="true" />
                  <span className="navbar-two__label">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <button className="navbar-two__logout" type="button" onClick={handleLogout}>
        <HiOutlinePower className="navbar-two__icon" aria-hidden="true" />
        <span className="navbar-two__label">Cerrar sesion</span>
      </button>
    </aside>
  )
}

export default NavbarTwo
