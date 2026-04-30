import { useEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FaGraduationCap,
  FaHandHoldingHeart,
  FaUsersGear,
} from 'react-icons/fa6'
import { FiCalendar } from 'react-icons/fi'
import { LuBuilding2, LuHandshake, LuRocket } from 'react-icons/lu'
import Footer from '../../components/footer/footer'
import Navbar from '../../components/navbar/navbar'
import './home.css'

type SupportGroup = {
  title: string
  description: string[]
  list?: string[]
  closing?: string
  accent: string
  icon: IconType
}

type ImpactStat = {
  value: number
  label: string
  icon: IconType
}

type Testimonial = {
  name: string
  role: string
  quote: string
  tone: string
  initials: string
}

type NewsItem = {
  title: string
  excerpt: string
  date: string
  tone: string
}

const heroSlides = [
  {
    title:
      'Creamos oportunidades reales para que personas y familias vuelvan a ser productivas.',
    eyebrow: 'EDIFICA',
    subtitle:
      'El programa de emprendimiento que transforma suenos en negocios sostenibles',
    ctaLabel: 'QUIERO EMPRENDER',
    ctaHref: '#mision',
    ctaIcon: '>',
  },
  {
    title:
      'Mas que ayuda, brindamos esperanza y oportunidades para un manana mas brillante y sostenible.',
    ctaLabel: 'CONOCENOS',
    ctaHref: '#sobre-nosotros',
  },
  {
    title: 'Bienestar dentro y fuera de la empresa',
    subtitle:
      'Acompanamos a las organizaciones fortaleciendo cultura, liderazgo y productividad humana.',
    ctaLabel: 'QUIERO MAS INFORMACION',
    ctaHref: '#contacto',
    ctaIcon: '>',
  },
]

const supportGroups: SupportGroup[] = [
  {
    title: 'Personas y familias en procesos de reconstruccion economica',
    description: [
      'La llamada pobreza oculta o pobreza vergonzante vive en hogares donde una quiebra, un despido o una enfermedad desordena la vida y la autoestima.',
      'A estas familias les damos lo mas valioso: una oportunidad real para volver a levantarse, recuperar su productividad y reconstruir su futuro desde el emprendimiento.',
    ],
    accent: 'support-card--purple',
    icon: LuHandshake,
  },
  {
    title: 'Emprendedores que quieren crear o fortalecer su negocio',
    description: [
      'Dirigimos nuestros esfuerzos hacia los visionarios que suenan con emprender y estructurar sus ideas de negocio a traves de nuestro programa de altos estudios en:',
    ],
    list: [
      'Mentoria',
      'Crecimiento personal',
      'Estrategia',
      'Finanzas',
      'Marketing',
      'Modelo de negocio',
      'Acompanamiento real y humano',
    ],
    closing: 'EDIFICA no solo ensena a emprender.',
    accent: 'support-card--pink',
    icon: LuRocket,
  },
  {
    title: 'Empresas comprometidas con su gente',
    description: ['Apoyamos a las organizaciones a fortalecer:'],
    list: [
      'Cultura',
      'Bienestar',
      'Liderazgo',
      'Productividad humana',
      'Vinculacion emocional',
      'Sentido de proposito',
    ],
    closing:
      'Ya sea acompanando a los colaboradores o a sus familias, ayudamos a construir equipos con mayor compromiso y desempeno.',
    accent: 'support-card--orange',
    icon: LuBuilding2,
  },
]

const missionPillars = [
  {
    title: 'Programa de altos estudios en emprendimiento EDIFICA',
    note: 'Ruta de negocio, mentoria y acompanamiento real para convertir una idea en proyecto sostenible.',
    tone: 'mission-pillar--blue',
  },
  {
    title: 'Equipo de coaches certificados y desarrollo integral',
    note: 'Formacion humana para restaurar seguridad, enfoque y capacidad de liderar en medio del cambio.',
    tone: 'mission-pillar--gray',
  },
  {
    title: 'Apoyo espiritual para fortalecer desde adentro',
    note: 'Espacios de sentido, escucha y fe para sostener la reconstruccion personal y familiar.',
    tone: 'mission-pillar--sunset',
  },
]

const historyMoments = [
  'Perdida, fe y reconstruccion como origen',
  '10 anos acompanando procesos reales',
  'Emprendimiento con proposito y bienestar',
]

const impactStats: ImpactStat[] = [
  {
    value: 1200,
    label: 'Personas y familias en su reconstruccion productiva',
    icon: FaUsersGear,
  },
  {
    value: 70,
    label: 'Empresas comprometidas con su gente',
    icon: FaGraduationCap,
  },
  {
    value: 65,
    label: 'Mentores y voluntarios al servicio',
    icon: FaHandHoldingHeart,
  },
  {
    value: 10,
    label: 'Anos transformando vidas y culturas',
    icon: FiCalendar,
  },
]

const testimonials: Testimonial[] = [
  {
    name: 'Diana Galindo',
    role: 'Emprendedora graduada',
    quote:
      'Recupere mi confianza y convierti mi experiencia en una idea que hoy sostiene a mi familia.',
    tone: 'testimonial-card--purple',
    initials: 'DG',
  },
  {
    name: 'Nelly Pantoja',
    role: 'Participante EDIFICA',
    quote:
      'Aqui no solo me ensenaron a emprender, tambien me devolvieron claridad, disciplina y esperanza.',
    tone: 'testimonial-card--pink',
    initials: 'NP',
  },
  {
    name: 'Kelly Diaz',
    role: 'Aliada de comunidad',
    quote:
      'El acompanamiento humano fue la diferencia para pasar del miedo a tomar accion con proposito.',
    tone: 'testimonial-card--orange',
    initials: 'KD',
  },
  {
    name: 'Martha Cuellar',
    role: 'Lider de hogar',
    quote:
      'Volvi a confiar en mi proceso y encontre una comunidad que me acompano sin juzgarme.',
    tone: 'testimonial-card--purple',
    initials: 'MC',
  },
  {
    name: 'Carlos Herrera',
    role: 'Aliado empresarial',
    quote:
      'Con Colombia Comparte logramos hablar de bienestar con resultados y acciones sostenibles.',
    tone: 'testimonial-card--pink',
    initials: 'CH',
  },
  {
    name: 'Luisa Pardo',
    role: 'Emprendedora EDIFICA',
    quote:
      'Lo mas valioso fue entender que mi historia no era el final, sino el punto de partida.',
    tone: 'testimonial-card--orange',
    initials: 'LP',
  },
]

const newsItems: NewsItem[] = [
  {
    title:
      'Colombia Comparte participo en la Semana del Talento 2024, elevando la productividad nacional.',
    excerpt:
      'En un evento lleno de inspiracion, compartimos herramientas practicas para impulsar equipos mas humanos y productivos.',
    date: '22 FEB',
    tone: 'news-card--photo',
  },
  {
    title: 'Inicia el primer programa EDIFICA 2024',
    excerpt:
      'Grandes noticias para Colombia: arranco una nueva cohorte enfocada en emprendimiento con proposito y bienestar.',
    date: '22 ENE',
    tone: 'news-card--brand',
  },
  {
    title: 'La increible historia de los ricos pobres',
    excerpt:
      'La Fundacion Colombia Comparte atiende a familias que lo tuvieron todo y hoy necesitan una ruta para levantarse.',
    date: '04 MAY',
    tone: 'news-card--radio',
  },
  {
    title: 'Pobreza oculta e hipoteca inversa, por que estan relacionados',
    excerpt:
      'Exploramos decisiones que impactan la estabilidad de los hogares y el bienestar de quienes atraviesan transiciones complejas.',
    date: '03 MAY',
    tone: 'news-card--city',
  },
  {
    title: 'Nuevo ciclo de conferencias para empresas con proposito',
    excerpt:
      'Abrimos una ruta de encuentros para lideres que quieren fortalecer cultura, liderazgo y bienestar.',
    date: '12 MAR',
    tone: 'news-card--brand',
  },
  {
    title: 'EDIFICA suma mentores para acompañar negocios emergentes',
    excerpt:
      'Seguimos ampliando la red de especialistas que dona tiempo y experiencia para apoyar emprendedores.',
    date: '08 ABR',
    tone: 'news-card--photo',
  },
]

function rotateItems<T>(items: T[], startIndex: number) {
  return [...items.slice(startIndex), ...items.slice(0, startIndex)]
}

function formatImpactValue(value: number) {
  return value.toLocaleString('en-US')
}

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentNews, setCurrentNews] = useState(0)
  const [missionVisible, setMissionVisible] = useState(false)
  const [impactVisible, setImpactVisible] = useState(false)
  const [impactCounts, setImpactCounts] = useState(() => impactStats.map(() => 0))
  const missionRef = useRef<HTMLElement | null>(null)
  const impactRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const intervalId = globalThis.setInterval(() => {
      setCurrentSlide((previousSlide) => (previousSlide + 1) % heroSlides.length)
    }, 6000)

    return () => globalThis.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const intervalId = globalThis.setInterval(() => {
      setCurrentTestimonial(
        (previousTestimonial) => (previousTestimonial + 1) % testimonials.length,
      )
    }, 5200)

    return () => globalThis.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const intervalId = globalThis.setInterval(() => {
      setCurrentNews((previousNews) => (previousNews + 1) % newsItems.length)
    }, 5400)

    return () => globalThis.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const node = missionRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMissionVisible(entry.isIntersecting)
      },
      { threshold: 0.28 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = impactRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setImpactVisible(entry.isIntersecting)
      },
      { threshold: 0.3 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!impactVisible) {
      return
    }

    const duration = 1400
    const startTime = performance.now()
    let frameId = 0

    const tick = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setImpactCounts(
        impactStats.map((stat) => Math.round(stat.value * eased)),
      )

      if (progress < 1) {
        frameId = globalThis.requestAnimationFrame(tick)
      }
    }

    frameId = globalThis.requestAnimationFrame(tick)

    return () => globalThis.cancelAnimationFrame(frameId)
  }, [impactVisible])

  const activeSlide = heroSlides[currentSlide]
  const visibleTestimonials = rotateItems(testimonials, currentTestimonial).slice(0, 3)
  const visibleNews = [
    newsItems[currentNews],
    newsItems[(currentNews + 1) % newsItems.length],
  ]

  return (
    <div className="home">
      <Navbar />

      <main>
        <section className="hero-carousel" id="inicio" aria-label="Destacados">
          <div className="hero-carousel__viewport">
            {heroSlides.map((slide, index) => (
              <article
                key={slide.title}
                className={`hero-section hero-section--${index + 1} ${
                  index === currentSlide ? 'hero-section--active' : ''
                }`}
                aria-hidden={index !== currentSlide}
              >
                <div className="hero-section__inner">
                  <h1 className="hero-section__title">{slide.title}</h1>

                  {slide.eyebrow ? (
                    <p className="hero-section__eyebrow">{slide.eyebrow}</p>
                  ) : null}

                  {slide.subtitle ? (
                    <p className="hero-section__subtitle">{slide.subtitle}</p>
                  ) : null}

                  <a className="hero-section__cta" href={slide.ctaHref}>
                    {slide.ctaIcon ? (
                      <span className="hero-section__cta-icon" aria-hidden="true">
                        {slide.ctaIcon}
                      </span>
                    ) : null}
                    <span>{slide.ctaLabel}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--left"
            onClick={() =>
              setCurrentSlide((previousSlide) =>
                previousSlide === 0 ? heroSlides.length - 1 : previousSlide - 1,
              )
            }
            aria-label="Slide anterior"
          >
            {'<'}
          </button>

          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--right"
            onClick={() =>
              setCurrentSlide((previousSlide) => (previousSlide + 1) % heroSlides.length)
            }
            aria-label="Slide siguiente"
          >
            {'>'}
          </button>

          <div className="hero-carousel__dots" aria-label="Indicadores">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.ctaLabel}
                type="button"
                className={`hero-carousel__dot ${
                  index === currentSlide ? 'hero-carousel__dot--active' : ''
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Ir al slide ${index + 1}`}
                aria-current={index === currentSlide}
              />
            ))}
          </div>

          <p className="hero-carousel__sr-only" aria-live="polite">
            {activeSlide.title}
          </p>
        </section>

        <section className="support-section" id="sobre-nosotros">
          <div className="support-section__header">
            <p className="support-section__kicker">A QUIENES APOYAMOS</p>
            <p className="support-section__lead">
              En Colombia Comparte impulsamos el progreso humano y productivo dentro
              y fuera de la empresa.
            </p>
            <p className="support-section__copy">
              Acompanamos a tres publicos principales:
            </p>
          </div>

          <div className="support-grid" id="programas">
            {supportGroups.map((group) => {
              const Icon = group.icon

              return (
                <article key={group.title} className={`support-card ${group.accent}`}>
                  <div className="support-card__inner">
                    <div className="support-card__face support-card__face--front">
                      <Icon className="support-card__icon support-card__icon--front" />
                      <h2 className="support-card__title support-card__title--front">
                        {group.title}
                      </h2>
                      <span
                        className="support-card__action support-card__action--front"
                        aria-hidden="true"
                      >
                        {'>>'}
                      </span>
                    </div>

                    <div className="support-card__face support-card__face--back">
                      <div className="support-card__back-scroll">
                        <h2 className="support-card__title">{group.title}</h2>

                        {group.description.map((paragraph) => (
                          <p key={paragraph} className="support-card__text">
                            {paragraph}
                          </p>
                        ))}

                        {group.list ? (
                          <ul className="support-card__list">
                            {group.list.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}

                        {group.closing ? (
                          <p className="support-card__text support-card__text--closing">
                            {group.closing}
                          </p>
                        ) : null}
                      </div>

                      <a className="support-card__action" href="#contacto" aria-label={group.title}>
                        <span aria-hidden="true">{'>>'}</span>
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section
          ref={missionRef}
          className={`mission-section ${missionVisible ? 'mission-section--visible' : ''}`}
          id="mision"
        >
          <div className="mission-section__intro">
            <h2 className="mission-section__title">Nuestra mision en accion</h2>
            <p className="mission-section__text">
              En la Fundacion Colombia Comparte, nuestra labor se sostiene en tres
              pilares que conectan emprendimiento, restauracion personal y cultura
              de cuidado.
            </p>
            <a className="mission-section__cta" href="#historia">
              CONOCENOS
            </a>
          </div>

          <div className="mission-section__grid">
            {missionPillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className={`mission-pillar ${pillar.tone}`}
                style={{ transitionDelay: `${index * 130}ms` }}
              >
                <div className="mission-pillar__overlay">
                  <h3 className="mission-pillar__title">{pillar.title}</h3>
                  <p className="mission-pillar__note">{pillar.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="history-section" id="historia">
          <div className="history-section__header">
            <h2 className="section-heading section-heading--blue">NUESTRA HISTORIA</h2>
            <p className="history-section__intro">
              Una historia real que paso de la perdida a la accion y convirtio la
              reconstruccion en una metodologia humana.
            </p>
          </div>

          <div className="history-story">
            <div className="history-story__content">
              <p>Colombia Comparte nacio de una historia real.</p>
              <p>Una historia de perdida, fe y reconstruccion.</p>
              <p>
                Sus cofundadores vivieron en carne propia lo que significa
                perderlo todo y aun asi levantarse.
              </p>
              <p>
                Descubrieron algo poderoso: cuando una persona vuelve a sentirse
                productiva, vuelve a vivir.
              </p>
              <p>
                Guiados por un profundo deseo de servir, crearon una organizacion
                para acompanar a quienes enfrentan la llamada pobreza oculta.
              </p>
            </div>

            <aside className="history-story__panel">
              <div className="history-story__quote">
                <span className="history-story__quote-mark" aria-hidden="true">
                  "
                </span>
                <p>
                  Cuando una persona se transforma, su familia cambia. Y cuando
                  las familias estan bien, las empresas prosperan.
                </p>
              </div>

              <div className="history-story__moments">
                {historyMoments.map((moment) => (
                  <div key={moment} className="history-story__moment">
                    <span className="history-story__dot" aria-hidden="true" />
                    <p>{moment}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section ref={impactRef} className="impact-section" id="impacto">
          <h2 className="section-heading section-heading--pink">Nuestro impacto</h2>
          <div className="impact-grid">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon

              return (
                <article key={stat.label} className="impact-card">
                  <Icon className="impact-card__watermark" />
                  <Icon className="impact-card__icon" />
                  <p className="impact-card__value">
                    {formatImpactValue(impactCounts[index])}
                  </p>
                  <p className="impact-card__label">{stat.label}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="testimonials-section">
          <h2 className="section-heading section-heading--purple">Testimonios</h2>
          <div className="testimonials-grid">
            {visibleTestimonials.map((testimonial, index) => (
              <article
                key={`${currentTestimonial}-${testimonial.name}`}
                className={`testimonial-card ${testimonial.tone} ${
                  index === 1 ? 'testimonial-card--focus' : ''
                }`}
              >
                <p className="testimonial-card__name">{testimonial.name}</p>
                <div className="testimonial-card__photo">
                  <span>{testimonial.initials}</span>
                </div>
                <p className="testimonial-card__role">{testimonial.role}</p>
                <p className="testimonial-card__quote">{testimonial.quote}</p>
              </article>
            ))}
          </div>

          <div className="testimonials-dots" aria-label="Indicadores de testimonios">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                className={`testimonials-dot ${
                  index === currentTestimonial ? 'testimonials-dot--active' : ''
                }`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="community-section" id="contacto">
          <div className="community-banner">
            <p className="community-banner__title">
              Conoce a los emprendedores de Colombia Comparte
            </p>
            <a className="community-banner__cta" href="#aula">
              Directorio de Emprendedores
            </a>
          </div>

          <div className="news-section" id="actualidad">
            <div className="news-section__header">
              <h2 className="section-heading section-heading--purple section-heading--left">
                Noticias
              </h2>
              <a className="news-section__more" href="#/noticias">
                VER MAS
              </a>
            </div>

            <div className="news-slider">
              <button
                type="button"
                className="side-arrow side-arrow--light"
                aria-label="Noticia anterior"
                onClick={() =>
                  setCurrentNews((previousNews) =>
                    previousNews === 0 ? newsItems.length - 1 : previousNews - 1,
                  )
                }
              >
                {'<'}
              </button>

              <div className="news-grid">
                {visibleNews.map((item) => (
                  <article
                    key={`${currentNews}-${item.title}`}
                    className={`news-card news-card--animated ${item.tone}`}
                  >
                    <div className="news-card__body">
                      <p className="news-card__meta">by Colombia Comparte</p>
                      <h3 className="news-card__title">{item.title}</h3>
                      <p className="news-card__excerpt">{item.excerpt}</p>
                      <a className="news-card__link" href="#/noticias">
                        LEER MAS
                      </a>
                    </div>
                    <div className="news-card__visual">
                      <span className="news-card__date">{item.date}</span>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="side-arrow side-arrow--light"
                aria-label="Noticia siguiente"
                onClick={() =>
                  setCurrentNews((previousNews) => (previousNews + 1) % newsItems.length)
                }
              >
                {'>'}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
