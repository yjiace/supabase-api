import React, { useState } from 'react'
import { Menu, X, Github, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: '首页', icon: Zap },
    { id: 'docs', label: 'API文档', icon: null },
    { id: 'testing', label: '接口测试', icon: null }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-dark-bg" />
            </div>
            <div className="text-xl font-bold text-cyber-light">
              Supabase <span className="text-neon-green">API</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    currentPage === item.id
                      ? 'text-neon-green border-b-2 border-neon-green'
                      : 'text-cyber-gray hover:text-neon-green hover:bg-dark-surface'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://github.com', '_blank')}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-cyber-gray hover:text-neon-green p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-surface border-t border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id)
                  setIsMenuOpen(false)
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 ${
                  currentPage === item.id
                    ? 'text-neon-green bg-dark-border'
                    : 'text-cyber-gray hover:text-neon-green hover:bg-dark-border'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-dark-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}