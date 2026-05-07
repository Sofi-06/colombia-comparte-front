import argentinaLogo from '../assets/Argentina Co N.png'
import chileLogo from '../assets/Chile Co N.png'
import colombiaLogo from '../assets/colombia-comparte.png'
import ecuadorLogo from '../assets/Ecuador Co N.png'

export type CountrySlug = 'colombia' | 'chile' | 'ecuador' | 'argentina'

export type CountryConfig = {
  slug: CountrySlug
  name: string
  brandName: string
  logo: string
  homePath: string
  newsPath: string
  testimonialsPath: string
  shortNav: boolean
}

export const countryConfigs: Record<CountrySlug, CountryConfig> = {
  colombia: {
    slug: 'colombia',
    name: 'Colombia',
    brandName: 'Colombia Comparte',
    logo: colombiaLogo,
    homePath: '#/home',
    newsPath: '#/noticias',
    testimonialsPath: '#/testimonios',
    shortNav: false,
  },
  chile: {
    slug: 'chile',
    name: 'Chile',
    brandName: 'Chile Comparte',
    logo: chileLogo,
    homePath: '#/pais/chile',
    newsPath: '#/pais/chile/noticias',
    testimonialsPath: '#/pais/chile/testimonios',
    shortNav: true,
  },
  ecuador: {
    slug: 'ecuador',
    name: 'Ecuador',
    brandName: 'Ecuador Comparte',
    logo: ecuadorLogo,
    homePath: '#/pais/ecuador',
    newsPath: '#/pais/ecuador/noticias',
    testimonialsPath: '#/pais/ecuador/testimonios',
    shortNav: true,
  },
  argentina: {
    slug: 'argentina',
    name: 'Argentina',
    brandName: 'Argentina Comparte',
    logo: argentinaLogo,
    homePath: '#/pais/argentina',
    newsPath: '#/pais/argentina/noticias',
    testimonialsPath: '#/pais/argentina/testimonios',
    shortNav: true,
  },
}

export function getCountryConfig(slug?: string | null) {
  if (!slug) {
    return countryConfigs.colombia
  }

  return countryConfigs[slug as CountrySlug] ?? countryConfigs.colombia
}
