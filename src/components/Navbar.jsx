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
            <div className="flex-shrink-0">
              <img 
                src={BuccLogo} 
                alt="BUCC Logo" 
                className="w-10 h-10 lg:w-12 lg:h-12 transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100">
                BRACU Computer Club
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Frame Editor
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                BUCC
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Professional Editor
              </span>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:scale-105"
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
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300"
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
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300"
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Professional Photo Editor
                </span>
              </div>
              
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
