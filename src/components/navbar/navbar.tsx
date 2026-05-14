import type { CountryConfig } from '../../config/countries'
import './navbar.css'

type NavbarProps = {
  country: CountryConfig
  onOpenRequestModal?: () => void
}

function Navbar({ country, onOpenRequestModal }: NavbarProps) {
  const navItems = country.shortNav
    ? [
        { label: 'Noticias', href: country.newsPath },
        { label: 'Testimonios', href: country.testimonialsPath },
        { label: 'Solicitudes', href: `${country.homePath}#contacto` },
      ]
    : [
        { label: 'Inicio', href: `${country.homePath}#inicio` },
        { label: 'Sobre nosotros', href: `${country.homePath}#sobre-nosotros` },
        { label: 'Programas', href: `${country.homePath}#programas`, dropdown: true },
        { label: 'Noticias', href: country.newsPath },
        { label: 'Contacto', href: `${country.homePath}#contacto` },
        { label: 'Tu Aula', href: `${country.homePath}#aula` },
      ]

  return (
    <header className="navbar">
      <a className="navbar__brand" href={`${country.homePath}#inicio`} aria-label={country.brandName}>
        <img className="navbar__logo" src={country.logo} alt="" />
        <div className="navbar__wordmark" aria-hidden="true">
          <span className="navbar__wordmark-line navbar__wordmark-line--top">
            <span>{country.name.toUpperCase()}</span>
          </span>
          <span className="navbar__wordmark-line navbar__wordmark-line--bottom">
            <span>COMPARTE</span>
          </span>
        </div>
      </a>

      <nav className="navbar__nav" aria-label="Principal">
        <ul className="navbar__menu">
          {navItems.map((item) => (
            <li key={item.label} className="navbar__menu-item">
              <a className="navbar__link" href={item.href}>
                <span>{item.label}</span>
                {item.dropdown ? (
                  <span className="navbar__chevron" aria-hidden="true">
                    {'\u2304'}
                  </span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {country.shortNav ? (
        <button type="button" className="navbar__donate" onClick={onOpenRequestModal}>
          <span>SOLICITAR</span>
          <span className="navbar__donate-icon" aria-hidden="true">
            {'\u2665'}
          </span>
        </button>
      ) : (
        <button type="button" className="navbar__donate" onClick={onOpenRequestModal}>
          <span>SOLICITUD</span>
          <span className="navbar__donate-icon" aria-hidden="true">
            {'\u2665'}
          </span>
        </button>
      )}
    </header>
  )
}

export default Navbar
