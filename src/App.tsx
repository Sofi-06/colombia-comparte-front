import { useEffect, useState } from 'react'
import { getCountryConfig } from './config/countries'
import Home from './pages/home/home'
import HomePrincipal from './pages/homePrincipal/homePrincipal'
import Login from './pages/login/login'
import News from './pages/news/news'
import EditarNoticesPage from './pages/superadmin/notices/editarNotices/editarNotices'
import NoticesPage from './pages/superadmin/notices/notices'
import Superadmin from './pages/superadmin/superadmin'
import CrearNoticesPage from './pages/superadmin/notices/crearNotices/crearNotices'
import CrearUsuarioPage from './pages/superadmin/usuario/crear-usuario/crearUsuario'
import EditarUsuarioPage from './pages/superadmin/usuario/editar-usuario/editarUsuario'
import UsersPage from './pages/superadmin/usuario/usuario'
import Testimonials from './pages/testimonials/testimonials'

type Page =
  | 'principal'
  | 'home'
  | 'news'
  | 'testimonials'
  | 'login'
  | 'superadmin'
  | 'notices'
  | 'create-notice'
  | 'edit-notice'
  | 'users'
  | 'create-user'
  | 'edit-user'

type AppRoute = {
  countrySlug: string
  page: Page
}

function hasActiveSession() {
  return Boolean(globalThis.localStorage.getItem('authToken'))
}

function getCurrentRoute(): AppRoute {
  const hash = globalThis.location.hash || ''

  if (hash.startsWith('#/superadmin/usuarios/crear')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'create-user' : 'login' }
  }

  if (hash.startsWith('#/superadmin/noticias/crear')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'create-notice' : 'login' }
  }

  if (hash.startsWith('#/superadmin/usuarios/editar/')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'edit-user' : 'login' }
  }

  if (hash.startsWith('#/superadmin/noticias/editar/')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'edit-notice' : 'login' }
  }

  if (hash.startsWith('#/superadmin/noticias')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'notices' : 'login' }
  }

  if (hash.startsWith('#/superadmin/usuarios')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'users' : 'login' }
  }

  if (hash.startsWith('#/superadmin')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'superadmin' : 'login' }
  }

  if (hash.startsWith('#/login')) {
    return { countrySlug: 'colombia', page: 'login' }
  }

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
      const nextRoute = getCurrentRoute()

      if (
        globalThis.location.hash.startsWith('#/superadmin') &&
        !hasActiveSession()
      ) {
        globalThis.location.replace('#/login')
        setCurrentRoute({ countrySlug: 'colombia', page: 'login' })
        return
      }

      setCurrentRoute(nextRoute)
    }

    globalThis.addEventListener('hashchange', handleHashChange)

    return () => globalThis.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (currentRoute.page === 'login') {
    return <Login />
  }

  if (currentRoute.page === 'superadmin') {
    return <Superadmin />
  }

  if (currentRoute.page === 'users') {
    return <UsersPage />
  }

  if (currentRoute.page === 'notices') {
    return <NoticesPage />
  }

  if (currentRoute.page === 'create-user') {
    return <CrearUsuarioPage />
  }

  if (currentRoute.page === 'create-notice') {
    return <CrearNoticesPage />
  }

  if (currentRoute.page === 'edit-user') {
    return <EditarUsuarioPage />
  }

  if (currentRoute.page === 'edit-notice') {
    return <EditarNoticesPage />
  }

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
