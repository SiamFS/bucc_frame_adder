import { useState } from 'react'
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'
import BuccLogo from '../assets/BUCC_Logo_icon.svg'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-bg-secondary/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 shadow-lg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="flex-shrink-0 flex items-center justify-center">
              <img 
                src={BuccLogo} 
                alt="BUCC Logo" 
                className="w-10 h-10 lg:w-12 lg:h-12 transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="flex items-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Frame Editor
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:scale-105 flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button and dark mode toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300 flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 animate-slide-down">
            <div className="flex flex-col items-start gap-4 px-4">              
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p>• Upload background photo and transparent frame</p>
                <p>• Adjust brightness, contrast, and zoom</p>
                <p>• Download high-quality images</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
