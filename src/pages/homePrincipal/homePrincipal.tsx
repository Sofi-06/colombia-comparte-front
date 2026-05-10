import { useEffect, useRef, useState } from 'react'
import {
  FaBuilding,
  FaCircleCheck,
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaLinkedinIn,
  FaPeopleGroup,
  FaSeedling,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa6'
import alpinaLogo from '../../assets/Alpina_S.A._logo.svg.png'
import argentinaLogo from '../../assets/Argentina Co N.png'
import cencosudLogo from '../../assets/Cencosud_logo.svg.png'
import chileLogo from '../../assets/Chile Co N.png'
import colombiaLogo from '../../assets/Colombia Co N.png'
import ecuadorLogo from '../../assets/Ecuador Co N.png'
import grupoExitoLogo from '../../assets/Grupo_Exito_logo.svg.png'
import heroBackground from '../../assets/manos-juntas.avif'
import ownersImage from '../../assets/dueños.jpg'
import homecenterLogo from '../../assets/Logo_Homecenter_Sodimac.png'
import latinoamericaLogo from '../../assets/Latinoamérica Co N.png'
import logoBlanco from '../../assets/Logo Blanco.png'
import './homePrincipal.css'

const navItems = [
  { label: 'QUIENES SOMOS', href: '#quienes-somos' },
  { label: 'NUESTRO IMPACTO', href: '#nuestro-impacto' },
  { label: 'EQUIPO', href: '#equipo' },
  { label: 'NOTICIAS', href: '#noticias' },
  { label: 'COMO APOYAR', href: '#como-apoyar' },
  { label: 'CONTACTENOS', href: '#contactenos' },
  { label: 'TU AULA', href: '#/home' },
]

const countryLinks = [
  { label: 'Colombia Comparte', image: colombiaLogo, href: '#/home', featured: false },
  { label: 'Ecuador Comparte', image: ecuadorLogo, href: '#/pais/ecuador', featured: false },
  { label: 'Latinoamerica Comparte', image: latinoamericaLogo, href: '#top', featured: true },
  { label: 'Chile Comparte', image: chileLogo, href: '#/pais/chile', featured: false },
  { label: 'Argentina Comparte', image: argentinaLogo, href: '#/pais/argentina', featured: false },
]

const impactStats = [
  {
    value: 10,
    suffix: '',
    label: 'anos de impacto social y empresarial',
    icon: FaCircleCheck,
  },
  {
    value: 1200,
    suffix: '',
    label: 'familias transformadas',
    icon: FaPeopleGroup,
  },
  {
    value: 700,
    suffix: '',
    label: 'emprendimientos creados',
    icon: FaSeedling,
  },
  {
    value: 40,
    suffix: '',
    label: 'empresas aliadas',
    icon: FaBuilding,
  },
]

const partnerLogos = [
  { name: 'Homecenter Sodimac', image: homecenterLogo },
  { name: 'Grupo Exito', image: grupoExitoLogo },
  { name: 'Alpina', image: alpinaLogo },
  { name: 'Cencosud', image: cencosudLogo },
  { name: 'Homecenter Sodimac 2', image: homecenterLogo },
  { name: 'Grupo Exito 2', image: grupoExitoLogo },
]

const teamMembers = [
  {
    name: 'Carolina Ruiz',
    role: 'Cofundadora y CEO para Latinoamerica Comparte',
    accent: 'team-card__media--purple',
    initials: 'CR',
  },
  {
    name: 'Marcela Moreno',
    role: 'Directora de relacionamiento regional',
    accent: 'team-card__media--peach',
    initials: 'MM',
  },
  {
    name: 'Eduardo Del Castillo',
    role: 'Cofundador y vicepresidente comercial',
    accent: 'team-card__media--blue',
    initials: 'EC',
  },
  {
    name: 'Paola Rodriguez',
    role: 'Lider de programas y comunidad',
    accent: 'team-card__media--rose',
    initials: 'PR',
  },
  {
    name: 'Valentina Torres',
    role: 'Coordinadora de bienestar y alianzas',
    accent: 'team-card__media--lilac',
    initials: 'VT',
  },
  {
    name: 'Juan Pablo Gomez',
    role: 'Director de expansion y estrategia',
    accent: 'team-card__media--mint',
    initials: 'JG',
  },
  {
    name: 'Daniela Pardo',
    role: 'Gestora de proyectos con impacto',
    accent: 'team-card__media--purple',
    initials: 'DP',
  },
  {
    name: 'Catalina Mesa',
    role: 'Lider de comunicaciones y red',
    accent: 'team-card__media--peach',
    initials: 'CM',
  },
  {
    name: 'Felipe Herrera',
    role: 'Mentor de emprendimiento regional',
    accent: 'team-card__media--blue',
    initials: 'FH',
  },
]

const newsItems = [
  {
    title: 'Historias que inspiran',
    description: 'Casos de exito y emprendedores que transforman sus comunidades.',
    tag: 'INSPIRACION',
    accent: 'news-card__visual--purple',
  },
  {
    title: 'Noticias corporativas',
    description: 'Nuevas alianzas y expansion regional.',
    tag: 'CORPORATIVO',
    accent: 'news-card__visual--pink',
  },
  {
    title: 'Eventos y conferencias',
    description: 'Red que transforma y espacios de encuentro en la region.',
    tag: 'EVENTOS',
    accent: 'news-card__visual--blue',
  },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/latinoamericacomparte/?hl=es-la',
    icon: FaInstagram,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/Ccomparte',
    icon: FaFacebookF,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/latinoam%C3%A9rica-comparte-emprendimiento-conferencias-productividad-empresarial/',
    icon: FaLinkedinIn,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@colombiacomparte',
    icon: FaYoutube,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@latinoamricacomparte',
    icon: FaTiktok,
  },
]

function HomePrincipal() {
  const [impactVisible, setImpactVisible] = useState(false)
  const [impactCounts, setImpactCounts] = useState(() => impactStats.map(() => 0))
  const [teamExpanded, setTeamExpanded] = useState(false)
  const impactRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = impactRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImpactVisible(true)
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!impactVisible) {
      return
    }

    const duration = 1600
    const startTime = performance.now()
    let frameId = 0

    const tick = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setImpactCounts(impactStats.map((stat) => Math.round(stat.value * eased)))

      if (progress < 1) {
        frameId = globalThis.requestAnimationFrame(tick)
      }
    }

    frameId = globalThis.requestAnimationFrame(tick)

    return () => globalThis.cancelAnimationFrame(frameId)
  }, [impactVisible])

  return (
    <div className="home-principal" id="top">
      <header className="home-principal__header">
        <a className="home-principal__brand" href="#top" aria-label="Latinoamerica Comparte">
          <img src={logoBlanco} alt="" />
        </a>

        <nav className="home-principal__nav" aria-label="Principal">
          {navItems.map((item) => (
            <a key={item.label} className="home-principal__nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="home-principal__login" href="#/login">
          Inicio de sesión
        </a>
      </header>

      <main>
        <section
          className="home-principal__hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(115, 13, 124, 0.84), rgba(117, 92, 201, 0.76)), url(${heroBackground})`,
          }}
        >
          <div className="home-principal__overlay" />

          <div className="home-principal__hero-content">
            <h1>UN PROPOSITO QUE NACIO DE COLOMBIA</h1>
            <p className="home-principal__hero-subtitle">HOY INSPIRA A TODA LATINOAMERICA</p>

            <div className="home-principal__countries" aria-label="Red latinoamericana">
              {countryLinks.map((item) => (
                <a
                  key={item.label}
                  className={`home-principal__country ${
                    item.featured ? 'home-principal__country--featured' : ''
                  }`}
                  href={item.href}
                  aria-label={item.label}
                >
                  <img src={item.image} alt={item.label} />
                </a>
              ))}
            </div>

            <p className="home-principal__hero-copy">
              Una red que une personas, empresas y comunidades, para construir una
              region mas humana, productiva y consciente.
            </p>

            <a className="home-principal__cta" href="#nuestro-impacto">
              Conoce mas
            </a>
          </div>
        </section>

        <section
          className="about-section-homeprincipal"
          id="quienes-somos"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.94)), url(${ownersImage})`,
          }}
        >
          <div className="about-section-homeprincipal__inner">
            <h2>QUIENES SOMOS</h2>

            <div className="about-section-homeprincipal__card">
              <div className="about-section-homeprincipal__badge">
                <img src={latinoamericaLogo} alt="Latinoamerica Comparte" />
              </div>

              <div className="about-section-homeprincipal__content">
                <p>
                  En Latinoamerica Comparte creemos que transformar personas es
                  transformar empresas.
                </p>
                <p>Nacimos de una historia real de perdida, fe y proposito.</p>
                <p>
                  Lo que comenzo en Colombia como un movimiento para ayudar a
                  familias a reconstruir su productividad, hoy se ha convertido en
                  una red continental que promueve el bienestar, la cultura
                  organizacional y el emprendimiento con proposito.
                </p>
                <p>
                  En cada país acompañamos a personas, familias y empresas a
                  reencontrar su propósito productivo y a construir un futuro
                  sostenible. Porque cuando un país comparte, Latinoamérica avanza.
                </p>
              </div>
            </div>

            <div className="about-section-homeprincipal__countries" aria-label="Presencia regional">
              {countryLinks
                .filter((item) => !item.featured)
                .map((item) => (
                  <a
                    key={item.label}
                    className="about-section-homeprincipal__country"
                    href={item.href}
                    aria-label={item.label}
                  >
                    <img src={item.image} alt={item.label} />
                  </a>
                ))}
            </div>
          </div>
        </section>

        <section ref={impactRef} className="impact-showcase" id="nuestro-impacto">
          <div className="impact-showcase__inner">
            <h2 className="impact-showcase__title">NUESTRO IMPACTO</h2>

            <div className="impact-showcase__grid">
              {impactStats.map((item, index) => {
                const Icon = item.icon

                return (
                  <article key={item.label} className="impact-showcase__card">
                    <div className="impact-showcase__icon-wrap">
                      <Icon className="impact-showcase__icon" />
                    </div>
                    <p className="impact-showcase__value">
                      {impactCounts[index]}
                      {item.suffix}
                    </p>
                    <p className="impact-showcase__label">{item.label}</p>
                  </article>
                )
              })}
            </div>

            <div className="impact-showcase__partners">
              <h3>Empresas que comparten</h3>
              <p>
                Las empresas que creen en el bienestar y la productividad con
                proposito hacen parte de esta red.
              </p>

              <div className="partner-marquee">
                <div className="partner-marquee__track">
                  {[...partnerLogos, ...partnerLogos].map((item, index) => (
                    <article key={`${item.name}-${index}`} className="partner-marquee__card">
                      <img src={item.image} alt={item.name} />
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section" id="equipo">
          <div className="team-section__header">
            <h2>NUESTRO EQUIPO</h2>
            <p>
              El corazon de Latinoamerica Comparte esta en las personas que dia a
              dia trabajan por transformar vidas.
            </p>

            <button
              type="button"
              className="team-section__toggle"
              onClick={() => setTeamExpanded((currentValue) => !currentValue)}
              aria-expanded={teamExpanded}
              aria-controls="team-grid"
            >
              <span>{teamExpanded ? 'Ver menos' : 'Conoce a nuestro equipo'}</span>
              <span
                className={`team-section__toggle-icon ${
                  teamExpanded ? 'team-section__toggle-icon--open' : ''
                }`}
              >
                ^
              </span>
            </button>
          </div>

          <div
            id="team-grid"
            className={`team-grid-wrap ${teamExpanded ? 'team-grid-wrap--open' : ''}`}
          >
            <div className="team-grid-scroll">
              <div className="team-grid">
                {teamMembers.map((member, index) => (
                  <article
                    key={member.name}
                    className={`team-card ${teamExpanded ? 'team-card--visible' : ''}`}
                    style={{ transitionDelay: `${index * 55}ms` }}
                  >
                    <div className={`team-card__media ${member.accent}`}>
                      <span>{member.initials}</span>
                    </div>
                    <div className="team-card__body">
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="news-section-homeprincipal" id="noticias">
          <div className="news-section-homeprincipal__header">
            <h2>NOTICIAS</h2>
            <p>Mantente al dia con nuestras ultimas novedades y casos de exito.</p>
          </div>

          <div className="news-section-homeprincipal__grid">
            {newsItems.map((item) => (
              <article key={item.title} className="news-card-homeprincipal">
                <div className={`news-card-homeprincipal__visual ${item.accent}`}>
                  <span>{item.tag}</span>
                </div>
                <div className="news-card-homeprincipal__body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#/noticias">Leer mas</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="support-section-homeprincipal" id="como-apoyar">
          <div className="support-section-homeprincipal__header">
            <h2>COMO APOYAR</h2>
            <p>Sumate a una red que transforma desde el proposito.</p>
          </div>

          <div className="support-section-homeprincipal__grid">
            <article className="support-card-homeprincipal">
              <div className="support-card-homeprincipal__icon-wrap">
                <FaPeopleGroup />
              </div>
              <h3>Empresas Aliadas</h3>
              <p>
                Vincula tu compania a nuestros programas e impulsa el bienestar de
                tus colaboradores.
              </p>
              <a className="support-card-homeprincipal__button" href="#contactenos">
                Mas informacion
              </a>
            </article>

            <article className="support-card-homeprincipal support-card-homeprincipal--donation">
              <span className="support-card-homeprincipal__tag">APOYA HOY</span>
              <div className="support-card-homeprincipal__icon-wrap support-card-homeprincipal__icon-wrap--heart">
                <FaHeart />
              </div>
              <h3>Donaciones Individuales</h3>
              <p>
                Tu aporte ayuda a mas personas a recuperar su productividad y
                esperanza.
              </p>

              <div className="donation-box">
                <div className="donation-box__row">
                  <span>Banco</span>
                  <strong>Bancolombia</strong>
                </div>
                <div className="donation-box__row">
                  <span>Tipo</span>
                  <strong>Cuenta de ahorros</strong>
                </div>
                <div className="donation-box__row donation-box__row--highlight">
                  <span>Numero</span>
                  <strong>084-000103-67</strong>
                </div>
                <div className="donation-box__row">
                  <span>A nombre de</span>
                  <strong>Fundacion Colombia Comparte</strong>
                </div>
                <div className="donation-box__row">
                  <span>NIT</span>
                  <strong>901.213.196-8</strong>
                </div>
              </div>

              <a className="support-card-homeprincipal__outline" href="#contactenos">
                Donar con tarjeta
              </a>
              <p className="support-card-homeprincipal__note">
                Tambien aceptamos tarjetas de credito y debito
              </p>
            </article>
          </div>
        </section>

        <section className="contact-section-homeprincipal" id="contactenos">
          <div className="contact-section-homeprincipal__header">
            <h2>CONTACTANOS</h2>
            <p>Pronto uno de nuestros gerentes regionales se pondra en contacto contigo.</p>
          </div>

          <form className="contact-form-homeprincipal">
            <div className="contact-form-homeprincipal__grid">
              <label className="contact-form-homeprincipal__field">
                <span>Nombre *</span>
                <input type="text" placeholder="Tu nombre" />
              </label>

              <label className="contact-form-homeprincipal__field">
                <span>Apellido</span>
                <input type="text" placeholder="Tu apellido" />
              </label>

              <label className="contact-form-homeprincipal__field">
                <span>Telefono</span>
                <input type="tel" placeholder="+57 300 123 4567" />
              </label>

              <label className="contact-form-homeprincipal__field">
                <span>País</span>
                <select defaultValue="">
                  <option value="" disabled>
                    Selecciona tu país
                  </option>
                  <option>Colombia</option>
                  <option>Ecuador</option>
                  <option>Chile</option>
                  <option>Argentina</option>
                  <option>Otro</option>
                </select>
              </label>
            </div>

            <label className="contact-form-homeprincipal__field">
              <span>Correo electronico *</span>
              <input type="email" placeholder="tucorreo@ejemplo.com" />
            </label>

            <label className="contact-form-homeprincipal__field">
              <span>En que podemos ayudarte? *</span>
              <textarea placeholder="Cuentanos como podemos ayudarte..." rows={6} />
            </label>

            <button type="submit" className="contact-form-homeprincipal__submit">
              Enviar mensaje
            </button>
          </form>
        </section>
      </main>

      <footer className="homeprincipal-footer">
        <div className="homeprincipal-footer__inner">
          <div className="homeprincipal-footer__brand">
            <img src={latinoamericaLogo} alt="Latinoamerica Comparte" />
            <p>"Cuando un país comparte, Latinoamérica avanza."</p>
          </div>

          <div className="homeprincipal-footer__links">
            <h3>Enlaces rapidos</h3>
            <a href="#top">Inicio</a>
            <a href="#nuestro-impacto">Impacto</a>
            <a href="#equipo">Equipo</a>
            <a href="#noticias">Noticias</a>
            <a href="#como-apoyar">Como apoyar</a>
            <a href="#contactenos">Contactanos</a>
          </div>

          <div className="homeprincipal-footer__socials">
            <h3>Siguenos</h3>
            <div className="homeprincipal-footer__social-row">
              {socialLinks.map((item) => {
                const Icon = item.icon

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePrincipal
