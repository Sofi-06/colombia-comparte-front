import { useEffect, useState } from 'react'
import { getCountryConfig } from './config/countries'
import Home from './pages/home/home'
import HomePrincipal from './pages/homePrincipal/homePrincipal'
import News from './pages/news/news'
import Testimonials from './pages/testimonials/testimonials'

type AppRoute = {
  countrySlug: string
  page: 'principal' | 'home' | 'news' | 'testimonials'
}

function getCurrentRoute(): AppRoute {
  const hash = window.location.hash || ''

  if (hash.startsWith('#/pais/')) {
    const [, , countrySlug, maybePage] = hash.slice(1).split('/')

    return {
      countrySlug: countrySlug || 'colombia',
      page:
        maybePage === 'noticias'
          ? 'news'
          : maybePage === 'testimonios'
            ? 'testimonials'
            : 'home',
    }
  }

  if (hash.startsWith('#/noticias')) {
    return { countrySlug: 'colombia', page: 'news' }
  }

  if (hash.startsWith('#/testimonios')) {
    return { countrySlug: 'colombia', page: 'testimonials' }
  }

  if (hash.startsWith('#/home')) {
    return { countrySlug: 'colombia', page: 'home' }
  }

  return { countrySlug: 'colombia', page: 'principal' }
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute)
  const country = getCountryConfig(currentRoute.countrySlug)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getCurrentRoute())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (currentRoute.page === 'news') {
    return <News country={country} />
  }

  if (currentRoute.page === 'home') {
    return <Home country={country} />
  }

  if (currentRoute.page === 'testimonials') {
    return <Testimonials country={country} />
  }

  return <HomePrincipal />
}

export default App
