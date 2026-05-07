import Footer from '../../components/footer/footer'
import Navbar from '../../components/navbar/navbar'
import type { CountryConfig } from '../../config/countries'
import './testimonials.css'

type TestimonialItem = {
  name: string
  role: string
  quote: string
  accent: string
  initials: string
}

const testimonialItems: TestimonialItem[] = [
  {
    name: 'Diana Galindo',
    role: 'Emprendedora graduada',
    quote:
      'Recupere mi confianza y converti mi experiencia en una idea que hoy sostiene a mi familia.',
    accent: 'testimonials-page-card--purple',
    initials: 'DG',
  },
  {
    name: 'Nelly Pantoja',
    role: 'Participante EDIFICA',
    quote:
      'Aqui no solo me ensenaron a emprender, tambien me devolvieron claridad, disciplina y esperanza.',
    accent: 'testimonials-page-card--pink',
    initials: 'NP',
  },
  {
    name: 'Carlos Herrera',
    role: 'Aliado empresarial',
    quote:
      'Con Colombia Comparte logramos hablar de bienestar con resultados y acciones sostenibles.',
    accent: 'testimonials-page-card--blue',
    initials: 'CH',
  },
  {
    name: 'Martha Cuellar',
    role: 'Lider de hogar',
    quote:
      'Volvi a confiar en mi proceso y encontre una comunidad que me acompano sin juzgarme.',
    accent: 'testimonials-page-card--orange',
    initials: 'MC',
  },
]

function adaptCountryCopy(text: string, country: CountryConfig) {
  return text.replaceAll('Colombia Comparte', country.brandName)
}

type TestimonialsProps = {
  country: CountryConfig
}

function Testimonials({ country }: TestimonialsProps) {
  const personalizedTestimonials = testimonialItems.map((item) => ({
    ...item,
    quote: adaptCountryCopy(item.quote, country),
  }))

  return (
    <div className="testimonials-page">
      <Navbar country={country} />

      <main>
        <section className="testimonials-page__hero">
          <div className="testimonials-page__hero-inner">
            <h1 className="testimonials-page__hero-title">
              {'Testimonios'.split('').map((char, index) => (
                <span
                  key={index}
                  className="testimonials-page__hero-letter"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
            <p className="testimonials-page__hero-copy">
              Historias reales de personas, familias y aliados que han vivido la
              transformacion de {country.brandName}.
            </p>
          </div>
        </section>

        <section className="testimonials-page__content">
          <div className="testimonials-page__intro">
            <p>
              Cada testimonio refleja una experiencia de reconstruccion,
              crecimiento y proposito compartido.
            </p>
          </div>

          <div className="testimonials-page__grid">
            {personalizedTestimonials.map((item) => (
              <article key={item.name} className={`testimonials-page-card ${item.accent}`}>
                <div className="testimonials-page-card__media">
                  <span>{item.initials}</span>
                </div>

                <div className="testimonials-page-card__body">
                  <p className="testimonials-page-card__meta">{country.brandName}</p>
                  <h2 className="testimonials-page-card__name">{item.name}</h2>
                  <p className="testimonials-page-card__role">{item.role}</p>
                  <blockquote className="testimonials-page-card__quote">
                    "{item.quote}"
                  </blockquote>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer country={country} />
    </div>
  )
}

export default Testimonials
