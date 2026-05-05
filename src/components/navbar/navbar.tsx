import logo from '../../assets/colombia-comparte.png'
import './navbar.css'

const navItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre nosotros', href: '#sobre-nosotros' },
  { label: 'Programas', href: '#programas', dropdown: true },
  { label: 'Noticias', href: '#/noticias' },
  { label: 'Contacto', href: '#contacto' },
  { label: 'Tu Aula', href: '#aula' },
]

function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar__brand" href="#inicio" aria-label="Colombia Comparte">
        <img className="navbar__logo" src={logo} alt="" />
        <div className="navbar__wordmark" aria-hidden="true">
          <span className="navbar__wordmark-line navbar__wordmark-line--top">
            <span>COLOMBIA</span>
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

      <a className="navbar__donate" href="#/login">
        <span>Iniciar sesion</span>
        <span className="navbar__donate-icon" aria-hidden="true">
          {'\u2665'}
        </span>
      </a>
    </header>
  )
}

export default Navbar
