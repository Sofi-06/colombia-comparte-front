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
import Login from './pages/login/login'
import News from './pages/news/news'
import Superadmin from './pages/superadmin/superadmin'
import CrearUsuarioPage from './pages/superadmin/usuario/crear-usuario/crearUsuario'
import EditarUsuarioPage from './pages/superadmin/usuario/editar-usuario/editarUsuario'
import UsersPage from './pages/superadmin/usuario/usuario'

function hasActiveSession() {
  return Boolean(globalThis.localStorage.getItem('authToken'))
}

function getCurrentPage() {
  if (globalThis.location.hash.startsWith('#/superadmin/usuarios/crear')) {
    if (!hasActiveSession()) {
      return 'login'
    }

    return 'create-user'
  }

  if (globalThis.location.hash.startsWith('#/superadmin/usuarios/editar/')) {
    if (!hasActiveSession()) {
      return 'login'
    }

    return 'edit-user'
  }

  if (globalThis.location.hash.startsWith('#/superadmin/usuarios')) {
    if (!hasActiveSession()) {
      return 'login'
    }

    return 'users'
  }

  if (globalThis.location.hash.startsWith('#/superadmin')) {
    if (!hasActiveSession()) {
      return 'login'
    }

    return 'superadmin'
  }

  if (globalThis.location.hash.startsWith('#/noticias')) {
    return 'news'
  }

  if (globalThis.location.hash.startsWith('#/login')) {
    return 'login'
  }

  return 'home'
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute)
  const country = getCountryConfig(currentRoute.countrySlug)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getCurrentRoute())
      if (
        globalThis.location.hash.startsWith('#/superadmin') &&
        !hasActiveSession()
      ) {
        globalThis.location.replace('#/login')
        setCurrentPage('login')
        return
      }

      setCurrentPage(getCurrentPage())
    }

    globalThis.addEventListener('hashchange', handleHashChange)

    return () => globalThis.removeEventListener('hashchange', handleHashChange)
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
  if (currentPage === 'news') {
    return <News />
  }

  if (currentPage === 'superadmin') {
    return <Superadmin />
  }

  if (currentPage === 'users') {
    return <UsersPage />
  }

  if (currentPage === 'create-user') {
    return <CrearUsuarioPage />
  }

  if (currentPage === 'edit-user') {
    return <EditarUsuarioPage />
  }

  if (currentPage === 'login') {
    return <Login />
  }

  return <Home />
}

export default App
