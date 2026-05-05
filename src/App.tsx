import { useEffect, useState } from 'react'
import Home from './pages/home/home'
import Login from './pages/login/login'
import News from './pages/news/news'
import Superadmin from './pages/superadmin/superadmin'

function hasActiveSession() {
  return Boolean(globalThis.localStorage.getItem('authToken'))
}

function getCurrentPage() {
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
  const [currentPage, setCurrentPage] = useState(getCurrentPage)

  useEffect(() => {
    const handleHashChange = () => {
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

  if (currentPage === 'news') {
    return <News />
  }

  if (currentPage === 'superadmin') {
    return <Superadmin />
  }

  if (currentPage === 'login') {
    return <Login />
  }

  return <Home />
}

export default App
