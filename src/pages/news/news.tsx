import { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'
import PublicRequestModal from '../../components/publicRequestModal/publicRequestModal'
import type { CountryConfig } from '../../config/countries'
import {
  getNewsPublicationDate,
  getPublicNews,
  type NewsRecord,
} from '../../services/news'
import {
  OPEN_PUBLIC_MODAL_EVENT,
  openCountryContactFlow,
  openRegionalDonationFlow,
  type PublicModalIntent,
} from '../../utils/publicNavigation'
import './news.css'

const newsItems = [
  {
    title: 'Nuevos speakers se unen a nuestro portafolio de conferencistas',
    excerpt:
      'Nos complace anunciar la incorporación de dos destacados profesionales a nuestro portafolio de conferencistas.',
    content:
      'Nos complace anunciar la incorporación de dos destacados profesionales a nuestro portafolio de conferencistas.',
    date: '22 FEB',
    visual: 'news-page-card__visual--photo',
    image: '',
  },
  {
    title: 'Inicia el segundo programa de altos estudios EDIFICA 2024',
    excerpt:
      'Nuevas oportunidades para Colombia: iniciamos una nueva cohorte enfocada en crecimiento humano y emprendimiento.',
    content:
      'Nuevas oportunidades para Colombia: iniciamos una nueva cohorte enfocada en crecimiento humano y emprendimiento.',
    date: '22 ENE',
    visual: 'news-page-card__visual--brand',
    image: '',
  },
  {
    title: 'La increible historia de los ricos pobres',
    excerpt:
      'La Fundación Colombia Comparte atiende a las familias que lo tuvieron todo y hoy no encuentran cómo volver a levantarse.',
    content:
      'La Fundación Colombia Comparte atiende a las familias que lo tuvieron todo y hoy no encuentran cómo volver a levantarse.',
    date: '04 MAY',
    visual: 'news-page-card__visual--radio',
    image: '',
  },
  {
    title: 'Pobreza oculta e hipoteca inversa, por qué están relacionados',
    excerpt:
      'El Gobierno acabó de reglamentar el polémico mecanismo de la hipoteca inversa. Exploramos su impacto en los hogares.',
    content:
      'El Gobierno acabó de reglamentar el polémico mecanismo de la hipoteca inversa. Exploramos su impacto en los hogares.',
    date: '03 MAY',
    visual: 'news-page-card__visual--city',
    image: '',
  },
]

function adaptCountryCopy(text: string, country: CountryConfig) {
  return text
    .replaceAll('Fundacion Colombia Comparte', `Fundacion ${country.brandName}`)
    .replaceAll('Colombia Comparte', country.brandName)
    .replaceAll('para Colombia:', `para ${country.name}:`)
}

type NewsProps = {
  country: CountryConfig
}

function News({ country }: NewsProps) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [dynamicNewsItems, setDynamicNewsItems] = useState<NewsRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  useEffect(() => {
    const loadPublicNews = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        const records = await getPublicNews(country.slug)
        setDynamicNewsItems(records)
      } catch {
        setHasError(true)
        setDynamicNewsItems([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadPublicNews()
  }, [country.slug])

  useEffect(() => {
    setFlippedCards([])
  }, [country.slug, dynamicNewsItems.length])

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

  const personalizedNewsItems = (dynamicNewsItems.length
    ? dynamicNewsItems.map((item, index) => ({
        title: item.titulo ?? 'Noticia sin título',
        excerpt: item.resumen ?? 'Sin resumen disponible.',
        content: item.contenido ?? item.resumen ?? 'Sin contenido disponible.',
        date: getNewsPublicationDate(item)
          ? new Date(getNewsPublicationDate(item)).toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'short',
            })
          : newsItems[index % newsItems.length]?.date ?? '00 XXX',
        visual: newsItems[index % newsItems.length]?.visual ?? 'news-page-card__visual--brand',
        image: item.imagen_principal_url ?? '',
      }))
    : newsItems
  ).map((item) => ({
    ...item,
    title: adaptCountryCopy(item.title, country),
    excerpt: adaptCountryCopy(item.excerpt, country),
  }))

  return (
    <div className="news-page">
      <Navbar
        country={country}
        onOpenRequestModal={() => openCountryContactFlow(country.slug, 'request')}
      />

      <main>
        <section className="news-page__hero">
          <div className="news-page__hero-inner">
            <h1 className="news-page__hero-title">
              {"Noticias".split("").map((char, i) => (
                <span
                  key={i}
                  className="news-page__hero-letter"
                  style={{ animationDelay: `${i * 0.13}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>
        </section>

        <section className="news-page__content">
          <div className="news-page__intro">
            <p>
              Mantente informado sobre nuestros logros, eventos y noticias
              relevantes.
            </p>
            {isLoading ? <p>Cargando noticias del portal...</p> : null}
            {!isLoading && hasError ? (
              <p>Mostramos noticias de referencia mientras se restablece la conexion.</p>
            ) : null}
          </div>

          <div className="news-page__grid">
            {personalizedNewsItems.map((item, index) => (
              <article
                key={item.title}
                className={`news-page-card ${flippedCards.includes(index) ? 'news-page-card--flipped' : ''}`}
              >
                <div className="news-page-card__inner">
                  <div className="news-page-card__face news-page-card__face--front">
                    <div
                      className={`news-page-card__visual ${item.visual} ${
                        item.image ? 'news-page-card__visual--image' : ''
                      }`}
                      style={
                        item.image
                          ? {
                              backgroundImage: `linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.16)), url(${item.image})`,
                            }
                          : undefined
                      }
                    >
                      {item.visual === 'news-page-card__visual--brand' ? (
                        <div className="news-page-card__brandmark" aria-hidden="true">
                          <span>EDI</span>
                          <span>FI</span>
                          <span>CA</span>
                          <strong>EMPRESAS</strong>
                        </div>
                      ) : null}
                    </div>

                    <div className="news-page-card__body">
                      <p className="news-page-card__meta">{country.brandName}</p>
                      <h2 className="news-page-card__title">{item.title}</h2>
                      <div className="news-page-card__excerpt-scroll">
                        <p className="news-page-card__excerpt">{item.excerpt}</p>
                      </div>
                      <button
                        type="button"
                        className="news-page-card__link"
                        onClick={() => toggleCard(index)}
                      >
                        LEER MAS
                      </button>
                    </div>

                    <span className="news-page-card__date">{item.date}</span>
                  </div>

                  <div className="news-page-card__face news-page-card__face--back">
                    <div className="news-page-card__back">
                      <div className="news-page-card__detail-block">
                        <span className="news-page-card__detail-label">Resumen</span>
                        <p className="news-page-card__content news-page-card__content--summary">
                          {item.excerpt}
                        </p>
                      </div>
                      <div className="news-page-card__detail-block">
                        <span className="news-page-card__detail-label">Contenido</span>
                        <p className="news-page-card__content">{item.content}</p>
                      </div>
                      <button
                        type="button"
                        className="news-page-card__link"
                        onClick={() => toggleCard(index)}
                      >
                        VOLVER
                      </button>
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
        subtitle="Completa el formulario y nuestro equipo te contactara sin salir del sitio."
      />
    </div>
  )
}

export default News
