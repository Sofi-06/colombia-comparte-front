import { useEffect, useState } from 'react'
import { getCountryConfig } from './config/countries'
import Home from './pages/home/home'
import HomePrincipal from './pages/homePrincipal/homePrincipal'
import Login from './pages/login/login'
import News from './pages/news/news'
import EditarNoticesPage from './pages/superadmin/notices/editarNotices/editarNotices'
import NoticesPage from './pages/superadmin/notices/notices'
import CreateRequestPage from './pages/superadmin/requests/createRequest/createRequest'
import EditRequestPage from './pages/superadmin/requests/editRequest/editRequest'
import RequestsPage from './pages/superadmin/requests/requests/requests'
import Superadmin from './pages/superadmin/superadmin'
import AuditsPage from './pages/superadmin/audits/audits'
import ChatbotAnalyticsPage from './pages/superadmin/chatbotAnalytics/chatbotAnalyticsPage'
import ChatbotFaqsPage from './pages/superadmin/chatbotAnalytics/chatbotFaqsPage'
import CrearNoticesPage from './pages/superadmin/notices/crearNotices/crearNotices'
import CrearTestimonialsPage from './pages/superadmin/testimonials/crearTestimonials/crearTestimonials'
import EditarTestimonialsPage from './pages/superadmin/testimonials/editarTestimonials/editarTestimonials'
import TestimonialsAdminPage from './pages/superadmin/testimonials/testimonialsAdmin'
import CrearUsuarioPage from './pages/superadmin/usuario/crear-usuario/crearUsuario'
import EditarUsuarioPage from './pages/superadmin/usuario/editar-usuario/editarUsuario'
import UsersPage from './pages/superadmin/usuario/usuario'
import Testimonials from './pages/testimonials/testimonials'
import CountriesPage from './pages/superadmin/countries/countries'
import CrearPaisPage from './pages/superadmin/countries/crearPais/crearPais'
import EditarPaisPage from './pages/superadmin/countries/editarPais/editarPais'
import { parsePublicHash } from './utils/publicNavigation'

type Page =
  | 'principal'
  | 'home'
  | 'news'
  | 'testimonials'
  | 'login'
  | 'superadmin'
  | 'requests'
  | 'create-request'
  | 'edit-request'
  | 'notices'
  | 'create-notice'
  | 'edit-notice'
  | 'admin-testimonials'
  | 'create-testimonial'
  | 'edit-testimonial'
  | 'users'
  | 'create-user'
  | 'edit-user'
  | 'countries'
  | 'create-country'
  | 'edit-country'
  | 'audits'
  | 'chatbot-analytics'
  | 'chatbot-faqs'

type AppRoute = {
  countrySlug: string
  page: Page
}

function hasActiveSession() {
  return Boolean(globalThis.localStorage.getItem('authToken'))
}

function getCurrentRoute(): AppRoute {
  const { routeHash } = parsePublicHash(globalThis.location.hash || '')
  const hash = routeHash || ''
  const isPanelRoute = hash.startsWith('#/panel')
  const isLegacyAdminRoute = hash.startsWith('#/superadmin')

  if (hash.startsWith('#/panel/usuarios/crear') || hash.startsWith('#/superadmin/usuarios/crear')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'create-user' : 'login' }
  }

  if (hash.startsWith('#/panel/noticias/crear') || hash.startsWith('#/superadmin/noticias/crear')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'create-notice' : 'login' }
  }

  if (hash.startsWith('#/panel/solicitudes/crear') || hash.startsWith('#/superadmin/solicitudes/crear')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'create-request' : 'login' }
  }

  if (hash.startsWith('#/panel/testimonios/crear') || hash.startsWith('#/superadmin/testimonios/crear')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'create-testimonial' : 'login' }
  }

  if (hash.startsWith('#/panel/paises/crear') || hash.startsWith('#/superadmin/paises/crear')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'create-country' : 'login' }
  }

  if (hash.startsWith('#/panel/usuarios/editar/') || hash.startsWith('#/superadmin/usuarios/editar/')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'edit-user' : 'login' }
  }

  if (hash.startsWith('#/panel/noticias/editar/') || hash.startsWith('#/superadmin/noticias/editar/')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'edit-notice' : 'login' }
  }

  if (hash.startsWith('#/panel/solicitudes/editar/') || hash.startsWith('#/superadmin/solicitudes/editar/')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'edit-request' : 'login' }
  }

  if (hash.startsWith('#/panel/testimonios/editar/') || hash.startsWith('#/superadmin/testimonios/editar/')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'edit-testimonial' : 'login' }
  }

  if (hash.startsWith('#/panel/paises/editar/') || hash.startsWith('#/superadmin/paises/editar/')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'edit-country' : 'login' }
  }

  if (hash.startsWith('#/panel/solicitudes') || hash.startsWith('#/superadmin/solicitudes')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'requests' : 'login' }
  }

  if (hash.startsWith('#/panel/noticias') || hash.startsWith('#/superadmin/noticias')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'notices' : 'login' }
  }

  if (hash.startsWith('#/panel/testimonios') || hash.startsWith('#/superadmin/testimonios')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'admin-testimonials' : 'login' }
  }

  if (hash.startsWith('#/panel/auditoria') || hash.startsWith('#/superadmin/auditoria')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'audits' : 'login' }
  }

  if (hash.startsWith('#/panel/chatbot/faqs') || hash.startsWith('#/superadmin/chatbot/faqs')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'chatbot-faqs' : 'login' }
  }

  if (hash.startsWith('#/panel/chatbot') || hash.startsWith('#/superadmin/chatbot')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'chatbot-analytics' : 'login' }
  }

  if (hash.startsWith('#/panel/paises') || hash.startsWith('#/superadmin/paises')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'countries' : 'login' }
  }

  if (hash.startsWith('#/panel/usuarios') || hash.startsWith('#/superadmin/usuarios')) {
    return { countrySlug: 'colombia', page: hasActiveSession() ? 'users' : 'login' }
  }

  if (isPanelRoute || isLegacyAdminRoute) {
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
        (globalThis.location.hash.startsWith('#/superadmin') ||
          globalThis.location.hash.startsWith('#/panel')) &&
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

  if (currentRoute.page === 'countries') {
    return <CountriesPage />
  }

  if (currentRoute.page === 'create-country') {
    return <CrearPaisPage />
  }

  if (currentRoute.page === 'edit-country') {
    return <EditarPaisPage />
  }

  if (currentRoute.page === 'requests') {
    return <RequestsPage />
  }

  if (currentRoute.page === 'create-request') {
    return <CreateRequestPage />
  }

  if (currentRoute.page === 'edit-request') {
    return <EditRequestPage />
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

  if (currentRoute.page === 'create-testimonial') {
    return <CrearTestimonialsPage />
  }

  if (currentRoute.page === 'edit-user') {
    return <EditarUsuarioPage />
  }

  if (currentRoute.page === 'edit-notice') {
    return <EditarNoticesPage />
  }

  if (currentRoute.page === 'edit-testimonial') {
    return <EditarTestimonialsPage />
  }

  if (currentRoute.page === 'admin-testimonials') {
    return <TestimonialsAdminPage />
  }

  if (currentRoute.page === 'audits') {
    return <AuditsPage />
  }

  if (currentRoute.page === 'chatbot-analytics') {
    return <ChatbotAnalyticsPage />
  }

  if (currentRoute.page === 'chatbot-faqs') {
    return <ChatbotFaqsPage />
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
