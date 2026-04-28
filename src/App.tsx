import { useEffect, useState } from 'react'
import Home from './pages/home/home'
import Login from './pages/login/login'
import News from './pages/news/news'

function getCurrentPage() {
  if (window.location.hash.startsWith('#/noticias')) {
    return 'news'
  }

  if (window.location.hash.startsWith('#/login')) {
    return 'login'
  }

  return 'home'
}

function App() {
  const [currentPage, setCurrentPage] = useState(getCurrentPage)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getCurrentPage())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (currentPage === 'news') {
    return <News />
  }

  if (currentPage === 'login') {
    return <Login />
  }

  return <Home />
}

export default App
