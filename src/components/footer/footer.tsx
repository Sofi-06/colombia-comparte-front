import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaYoutube } from 'react-icons/fa6'
import type { CountryConfig } from '../../config/countries'
import './footer.css'

const socialLinks = [
  { label: 'Facebook', icon: <FaFacebookF />, href: '#' },
  { label: 'Instagram', icon: <FaInstagram />, href: '#' },
  { label: 'TikTok', icon: <FaTiktok />, href: '#' },
  { label: 'LinkedIn', icon: <FaLinkedinIn />, href: '#' },
  { label: 'YouTube', icon: <FaYoutube />, href: '#' },
]

const contactItems = [
  { icon: 'P', text: '(+57) 321 230 2138', href: 'tel:+573212302138' },
  { icon: 'P', text: '(+57) 316 467 3087', href: 'tel:+573164673087' },
  {
    icon: '@',
    text: 'comunicaciones@colombiacomparte.com',
    href: 'mailto:comunicaciones@colombiacomparte.com',
  },
]

type FooterProps = {
  country: CountryConfig
  onOpenRequestModal?: () => void
}

function Footer({ country, onOpenRequestModal }: FooterProps) {
  const exploreColumns = country.shortNav
    ? [
        [
          { label: 'Inicio', href: `${country.homePath}#inicio` },
          { label: 'Noticias', href: country.newsPath },
        ],
        [
          { label: 'Testimonios', href: country.testimonialsPath },
          { label: 'Solicitudes', href: `${country.homePath}#contacto` },
        ],
      ]
    : [
        [
          { label: 'Inicio', href: `${country.homePath}#inicio` },
          { label: 'Quiénes somos', href: `${country.homePath}#sobre-nosotros` },
          { label: 'Programa EDIFICA', href: `${country.homePath}#programas` },
          { label: 'Shows y conferencias', href: `${country.homePath}#mision` },
          { label: 'Blog', href: `${country.homePath}#actualidad` },
        ],
        [
          { label: 'Noticias', href: country.newsPath },
          { label: 'Contacto', href: `${country.homePath}#contacto` },
          { label: 'Donaciones', href: `${country.homePath}#donaciones` },
          { label: 'Solicitudes DIAN', href: `${country.homePath}#contacto` },
        ],
      ]

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a className="footer__brand-link" href={`${country.homePath}#inicio`} aria-label={country.brandName}>
              <img className="footer__logo" src={country.logo} alt="" />
              <div className="footer__wordmark" aria-hidden="true">
                <span>{country.name.toUpperCase()}</span>
                <span>COMPARTE</span>
              </div>
            </a>

            <div className="footer__socials" aria-label="Redes sociales">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  className="footer__social"
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="footer__social-icon">{item.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="footer__explore">
            <h2 className="footer__heading">Explora</h2>
            <div className="footer__explore-columns">
              {exploreColumns.map((column, index) => (
                <ul key={`column-${index}`} className="footer__links">
                  {column.map((item) => (
                    <li key={item.label}>
                      {item.label === 'Solicitudes' || item.label === 'Donaciones' ? (
                        <button
                          type="button"
                          className="footer__link-button"
                          onClick={onOpenRequestModal}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <a href={item.href}>{item.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <div className="footer__contact">
            <h2 className="footer__heading">Contáctanos</h2>
            <ul className="footer__contact-list">
              {contactItems.map((item) => (
                <li key={item.text}>
                  <span className="footer__contact-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <a href={item.href}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>Copyright 2023 por Armadillo Azul SAS</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
