import React, { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Home } from '@/pages/home'
import { ApiDocs } from '@/pages/api-docs'
import { ApiTesting } from '@/pages/api-testing'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={setCurrentPage} />
      case 'docs':
        return <ApiDocs />
      case 'testing':
        return <ApiTesting />
      default:
        return <Home onPageChange={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

export default App