import { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'
import type { CountryConfig } from '../../config/countries'
import {
  getNewsPublicationDate,
  getPublicNews,
  type NewsRecord,
} from '../../services/news'
import './news.css'

const newsItems = [
  {
    title: 'Nuevos speakers se unen a nuestro portafolio de conferencistas',
    excerpt:
      'Nos complace anunciar la incorporacion de dos destacados profesionales a nuestro portafolio de conferencistas.',
    date: '22 FEB',
    visual: 'news-page-card__visual--photo',
    image: '',
  },
  {
    title: 'Inicia el segundo programa de altos estudios EDIFICA 2024',
    excerpt:
      'Nuevas oportunidades para Colombia: iniciamos una nueva cohorte enfocada en crecimiento humano y emprendimiento.',
    date: '22 ENE',
    visual: 'news-page-card__visual--brand',
    image: '',
  },
  {
    title: 'La increible historia de los ricos pobres',
    excerpt:
      'La Fundacion Colombia Comparte atiende a las familias que lo tuvieron todo y hoy no encuentran como volver a levantarse.',
    date: '04 MAY',
    visual: 'news-page-card__visual--radio',
    image: '',
  },
  {
    title: 'Pobreza oculta e hipoteca inversa, por que estan relacionados',
    excerpt:
      'El Gobierno acabo de reglamentar el polemico mecanismo de la hipoteca inversa. Exploramos su impacto en los hogares.',
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
  const [dynamicNewsItems, setDynamicNewsItems] = useState<NewsRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

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

  const personalizedNewsItems = (dynamicNewsItems.length
    ? dynamicNewsItems.map((item, index) => ({
        title: item.titulo ?? 'Noticia sin titulo',
        excerpt: item.resumen ?? 'Sin resumen disponible.',
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
      <Navbar country={country} />

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
            {personalizedNewsItems.map((item) => (
              <article key={item.title} className="news-page-card">
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
                  <p className="news-page-card__excerpt">{item.excerpt}</p>
                  <a className="news-page-card__link" href={country.newsPath}>
                    LEER MAS
                  </a>
                </div>

                <span className="news-page-card__date">{item.date}</span>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer country={country} />
    </div>
  )
}

export default News
