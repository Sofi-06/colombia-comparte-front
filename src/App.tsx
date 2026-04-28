import { useEffect, useState } from 'react'
import Home from './pages/home/home'
import News from './pages/news/news'

function getCurrentPage() {
  return window.location.hash.startsWith('#/noticias') ? 'news' : 'home'
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

  return currentPage === 'news' ? <News /> : <Home />
}

export default App
