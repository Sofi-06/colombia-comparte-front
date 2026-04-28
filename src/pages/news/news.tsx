import Navbar from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'
import './news.css'

const newsItems = [
  {
    title: 'Nuevos speakers se unen a nuestro portafolio de conferencistas',
    excerpt:
      'Nos complace anunciar la incorporacion de dos destacados profesionales a nuestro portafolio de conferencistas.',
    date: '22 FEB',
    visual: 'news-page-card__visual--photo',
  },
  {
    title: 'Inicia el segundo programa de altos estudios EDIFICA 2024',
    excerpt:
      'Nuevas oportunidades para Colombia: iniciamos una nueva cohorte enfocada en crecimiento humano y emprendimiento.',
    date: '22 ENE',
    visual: 'news-page-card__visual--brand',
  },
  {
    title: 'La increible historia de los ricos pobres',
    excerpt:
      'La Fundacion Colombia Comparte atiende a las familias que lo tuvieron todo y hoy no encuentran como volver a levantarse.',
    date: '04 MAY',
    visual: 'news-page-card__visual--radio',
  },
  {
    title: 'Pobreza oculta e hipoteca inversa, por que estan relacionados',
    excerpt:
      'El Gobierno acabo de reglamentar el polemico mecanismo de la hipoteca inversa. Exploramos su impacto en los hogares.',
    date: '03 MAY',
    visual: 'news-page-card__visual--city',
  },
]

function News() {
  return (
    <div className="news-page">
      <Navbar />

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
          </div>

          <div className="news-page__grid">
            {newsItems.map((item) => (
              <article key={item.title} className="news-page-card">
                <div className={`news-page-card__visual ${item.visual}`}>
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
                  <p className="news-page-card__meta">Colombia Comparte</p>
                  <h2 className="news-page-card__title">{item.title}</h2>
                  <p className="news-page-card__excerpt">{item.excerpt}</p>
                  <a className="news-page-card__link" href="#/noticias">
                    LEER MAS
                  </a>
                </div>

                <span className="news-page-card__date">{item.date}</span>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default News
