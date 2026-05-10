import { useEffect, useMemo, useState } from 'react'
import {
  HiOutlineBars3CenterLeft,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineNewspaper,
  HiOutlinePower,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
} from 'react-icons/hi2'
import {
  getDashboardBrandByCountry,
  type DashboardBrand,
  getRegionalDashboardBrand,
} from '../../config/countries'
import {
  clearStoredDashboardCountry,
  getNormalizedRole,
  getStoredAuthUser,
  getStoredDashboardCountry,
} from '../../services/auth'
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
    href: '#/superadmin/noticias',
    icon: HiOutlineNewspaper,
  },
  {
    id: 'testimonios',
    label: 'Testimonios',
    href: '#/superadmin/testimonios',
    icon: HiOutlineChatBubbleLeftRight,
  },
] as const

function NavbarTwo({
  activeItem = 'dashboard',
  collapsed = false,
  onToggleCollapse,
}: NavbarTwoProps) {
  const authUser = useMemo(getStoredAuthUser, [])
  const normalizedRole = getNormalizedRole(authUser)
  const storedDashboardCountry = getStoredDashboardCountry()
  const fallbackBrand = useMemo(
    () =>
      normalizedRole === 'superadmin'
        ? getRegionalDashboardBrand()
        : getDashboardBrandByCountry(
            authUser?.pais_slug ??
              authUser?.pais ??
              authUser?.paises?.slug ??
              authUser?.paises?.nombre ??
              storedDashboardCountry,
          ),
    [authUser, normalizedRole, storedDashboardCountry],
  )
  const [brand, setBrand] = useState<DashboardBrand>(fallbackBrand)

  useEffect(() => {
    setBrand(fallbackBrand)
  }, [fallbackBrand])

  useEffect(() => {
    if (normalizedRole === 'superadmin') {
      setBrand(getRegionalDashboardBrand())
    }
  }, [normalizedRole])

  const handleLogout = () => {
    globalThis.localStorage.removeItem('authToken')
    globalThis.localStorage.removeItem('authUser')
    clearStoredDashboardCountry()
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
        <img className="navbar-two__logo" src={brand.logo} alt="" />
        <div className="navbar-two__brand-copy">
          <span className="navbar-two__brand-title">{brand.name}</span>
          <span className="navbar-two__brand-subtitle">
            {brand.brandName.replace(`${brand.name} `, '')}
          </span>
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
        <span className="navbar-two__label">Cerrar sesión</span>
      </button>
    </aside>
  )
}

export default NavbarTwo
