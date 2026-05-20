import { useEffect, useState } from 'react'
import Footer from '../../components/footer/footer'
import Navbar from '../../components/navbar/navbar'
import PublicRequestModal from '../../components/publicRequestModal/publicRequestModal'
import type { CountryConfig } from '../../config/countries'
import {
  getPublicTestimonials,
  getTestimonialPublicationDate,
  type TestimonialRecord,
} from '../../services/testimonials'
import {
  OPEN_PUBLIC_MODAL_EVENT,
  openCountryContactFlow,
  openRegionalDonationFlow,
  type PublicModalIntent,
} from '../../utils/publicNavigation'
import './testimonials.css'

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  // If the value doesn't look like an external or YouTube URL, avoid calling URL()
  if (
    !trimmed.includes('youtube') &&
    !trimmed.includes('youtu.be') &&
    !/^https?:\/\//i.test(trimmed) &&
    !trimmed.startsWith('//') &&
    !trimmed.startsWith('/')
  ) {
    return trimmed
  }

  try {
    const u = new URL(trimmed)
    const host = u.hostname.replace('www.', '')

    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`
    }

    if (host.includes('youtu.be')) {
      const id = u.pathname.split('/').findLast(Boolean)
      if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
    }

    // fallback: return original (may be unsafe if not from youtube)
    return trimmed
  } catch {
    return trimmed ?? ''
  }
}

type TestimonialItem = {
  name: string
  role: string
  quote: string
  accent: string
  initials: string
  image?: string
  video?: string
  date?: string
}

function getTestimonialMediaContent(item: TestimonialItem) {
  const videoUrl = item.video ?? ''

  if (item.image && videoUrl) {
    return (
      <>
        <div
          className="testimonials-page-card__media--image"
          style={{
            backgroundImage: `linear-gradient(145deg, rgba(25, 33, 61, 0.18), rgba(15, 23, 42, 0.3)), url(${item.image})`,
          }}
        />
        <div className="testimonials-page-card__video-front">
          <iframe
            width="100%"
            height="100%"
            src={getYouTubeEmbedUrl(videoUrl)}
            title={`Video de ${item.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </>
    )
  }

  if (videoUrl) {
    return (
      <div className="testimonials-page-card__video-front">
        <iframe
          width="100%"
          height="180"
          src={getYouTubeEmbedUrl(videoUrl)}
          title={`Video de ${item.name}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    )
  }

  if (item.image) {
    return (
      <div
        className="testimonials-page-card__media--image"
        style={{
          backgroundImage: `linear-gradient(145deg, rgba(25, 33, 61, 0.18), rgba(15, 23, 42, 0.3)), url(${item.image})`,
        }}
      />
    )
  }

  return <span>{item.initials}</span>
}

const testimonialItems: TestimonialItem[] = [
  {
    name: 'Diana Galindo',
    role: 'Emprendedora graduada',
    quote:
      'Recuperé mi confianza y convertí mi experiencia en una idea que hoy sostiene a mi familia.',
    accent: 'testimonials-page-card--purple',
    initials: 'DG',
    image: '',
    date: '',
  },
  {
    name: 'Nelly Pantoja',
    role: 'Participante EDIFICA',
    quote:
      'Aquí no solo me enseñaron a emprender, también me devolvieron claridad, disciplina y esperanza.',
    accent: 'testimonials-page-card--pink',
    initials: 'NP',
    image: '',
    date: '',
  },
  {
    name: 'Carlos Herrera',
    role: 'Aliado empresarial',
    quote:
      'Con Colombia Comparte logramos hablar de bienestar con resultados y acciones sostenibles.',
    accent: 'testimonials-page-card--blue',
    initials: 'CH',
    image: '',
    date: '',
  },
  {
    name: 'Martha Cuellar',
    role: 'Líder de hogar',
    quote:
      'Volví a confiar en mi proceso y encontré una comunidad que me acompañó sin juzgarme.',
    accent: 'testimonials-page-card--orange',
    initials: 'MC',
    image: '',
    date: '',
  },
]

function adaptCountryCopy(text: string, country: CountryConfig) {
  return text.replaceAll('Colombia Comparte', country.brandName)
}

type TestimonialsProps = Readonly<{
  country: CountryConfig
}>

const heroTitleLetters = [
  { char: 'T', key: 't' },
  { char: 'e', key: 'e' },
  { char: 's', key: 's-1' },
  { char: 't', key: 't-2' },
  { char: 'i', key: 'i' },
  { char: 'm', key: 'm' },
  { char: 'o', key: 'o-1' },
  { char: 'n', key: 'n' },
  { char: 'i', key: 'i-2' },
  { char: 'o', key: 'o-2' },
  { char: 's', key: 's-2' },
]

function Testimonials({ country }: TestimonialsProps) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [dynamicTestimonials, setDynamicTestimonials] = useState<TestimonialRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  useEffect(() => {
    const loadPublicTestimonials = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        const records = await getPublicTestimonials(country.slug)
        setDynamicTestimonials(records)
      } catch {
        setHasError(true)
        setDynamicTestimonials([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadPublicTestimonials()
  }, [country.slug])

  useEffect(() => {
    setFlippedCards([])
  }, [country.slug, dynamicTestimonials.length])

  useEffect(() => {
    const handleOpenPublicModal = (event: Event) => {
      const detail = (event as CustomEvent<{
        intent?: PublicModalIntent
        countrySlug?: string | null
      }>).detail

      if (detail?.countrySlug && detail.countrySlug !== country.slug) {
        return
      }

      if (detail?.intent === 'donation') {
        openRegionalDonationFlow()
        return
      }

      setIsRequestModalOpen(true)
    }

    globalThis.addEventListener(OPEN_PUBLIC_MODAL_EVENT, handleOpenPublicModal)

    return () => globalThis.removeEventListener(OPEN_PUBLIC_MODAL_EVENT, handleOpenPublicModal)
  }, [country.slug])

  const toggleCard = (index: number) => {
    setFlippedCards((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    )
  }

  const personalizedTestimonials = (dynamicTestimonials.length
    ? dynamicTestimonials.map((item, index) => ({
        name: item.nombre ?? 'Testimonio sin nombre',
        role: [item.cargo, item.empresa].filter(Boolean).join(' · ') || 'Comunidad beneficiaria',
        quote: item.contenido ?? 'Sin contenido disponible.',
        accent: testimonialItems[index % testimonialItems.length]?.accent ?? 'testimonials-page-card--purple',
        initials: (item.nombre ?? 'TS')
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? '')
          .join(''),
        image: item.foto_url ?? '',
        video: item.video_url ?? '',
        date: getTestimonialPublicationDate(item)
          ? new Date(getTestimonialPublicationDate(item)).toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '',
      }))
    : testimonialItems
  ).map((item) => ({
    ...item,
    quote: adaptCountryCopy(item.quote, country),
  }))

  return (
    <div className="testimonials-page">
      <Navbar
        country={country}
        onOpenRequestModal={() => openCountryContactFlow(country.slug, 'request')}
      />

      <main>
        <section className="testimonials-page__hero">
          <div className="testimonials-page__hero-inner">
            <h1 className="testimonials-page__hero-title">
              {heroTitleLetters.map(({ char, key }, index) => (
                <span
                  key={key}
                  className="testimonials-page__hero-letter"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
            <p className="testimonials-page__hero-copy">
              Historias reales de personas, familias y aliados que han vivido la
              transformación de {country.brandName}.
            </p>
          </div>
        </section>

        <section className="testimonials-page__content">
          <div className="testimonials-page__intro">
            <p>
              Cada testimonio refleja una experiencia de reconstrucción,
              crecimiento y propósito compartido.
            </p>
            {isLoading ? <small>Cargando testimonios del portal...</small> : null}
            {!isLoading && hasError ? (
              <small>Mostramos testimonios de referencia mientras se restablece la conexión.</small>
            ) : null}
          </div>

          <div className="testimonials-page__grid">
            {personalizedTestimonials.map((item, index) => (
              <article
                key={item.name}
                className={`testimonials-page-card ${item.accent} ${
                  flippedCards.includes(index) ? 'testimonials-page-card--flipped' : ''
                }`}
              >
                <div className="testimonials-page-card__inner">
                  <div className="testimonials-page-card__face testimonials-page-card__face--front">
                    <div
                      className={`testimonials-page-card__media ${item.image && (item.video ?? '') ? 'testimonials-page-card__media--split' : ''}`}
                    >
                      {getTestimonialMediaContent(item)}
                    </div>

                    <div className="testimonials-page-card__body">
                      <p className="testimonials-page-card__meta">{country.brandName}</p>
                      <h2 className="testimonials-page-card__name">{item.name}</h2>
                      <p className="testimonials-page-card__role">{item.role}</p>
                      {item.date ? (
                        <p className="testimonials-page-card__date">{item.date}</p>
                      ) : null}
                      <blockquote className="testimonials-page-card__quote">
                        "{item.quote}"
                      </blockquote>
                      <button
                        type="button"
                        className="testimonials-page-card__action"
                        onClick={() => toggleCard(index)}
                      >
                        LEER MÁS
                      </button>
                    </div>
                  </div>

                  <div className="testimonials-page-card__face testimonials-page-card__face--back">
                    <div className="testimonials-page-card__back">
                      <div className="testimonials-page-card__back-content">
                        {item.image ? (
                          <div
                            className="testimonials-page-card__back-media"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                        ) : null}

                        <div className="testimonials-page-card__detail-block">
                          <span className="testimonials-page-card__detail-label">Nombre</span>
                          <h2 className="testimonials-page-card__name">{item.name}</h2>
                        </div>

                        <div className="testimonials-page-card__detail-block">
                          <span className="testimonials-page-card__detail-label">Contenido</span>
                          <p className="testimonials-page-card__back-copy">{item.quote}</p>
                        </div>

                        <button
                          type="button"
                          className="testimonials-page-card__action"
                          onClick={() => toggleCard(index)}
                        >
                          VOLVER
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer
        country={country}
        onOpenRequestModal={() => openCountryContactFlow(country.slug, 'request')}
        onOpenDonationModal={() => openRegionalDonationFlow()}
      />
      <PublicRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        initialCountrySlug={country.slug}
        title={`Solicita apoyo en ${country.name}`}
        subtitle="Comparte tus datos y te contactaremos desde el equipo local."
      />
    </div>
  )
}

export default Testimonials
