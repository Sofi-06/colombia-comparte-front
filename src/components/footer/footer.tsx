
import logo from '../../assets/colombia-comparte.png'
import './footer.css'
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaYoutube } from 'react-icons/fa6'

const exploreColumns = [
  [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Quienes somos', href: '#sobre-nosotros' },
    { label: 'Programa edifica', href: '#programas' },
    { label: 'Shows y conferencias', href: '#mision' },
    { label: 'Blog', href: '#actualidad' },
  ],
  [
    { label: 'Noticias', href: '#/noticias' },
    { label: 'Contacto', href: '#contacto' },
    { label: 'Donaciones', href: '#donaciones' },
    { label: 'Solicitudes DIAN', href: '#contacto' },
  ],
]

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

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a className="footer__brand-link" href="#inicio" aria-label="Colombia Comparte">
              <img className="footer__logo" src={logo} alt="" />
              <div className="footer__wordmark" aria-hidden="true">
                <span>COLOMBIA</span>
                <span>COMPARTE</span>
              </div>
            </a>

            <div className="footer__socials" aria-label="Redes sociales">
              {socialLinks.map((item) => (
                <a key={item.label} className="footer__social" href={item.href} aria-label={item.label} target="_blank" rel="noopener noreferrer">
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
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <div className="footer__contact">
            <h2 className="footer__heading">Contactanos</h2>
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
          <p>{'© Copyright 2023 por Armadillo Azul SAS'}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
