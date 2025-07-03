import { useState, useEffect } from 'react'
import ImageEditor from './components/ImageEditor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { organizationConfig, appConfig } from './config/theme'
import CaptionBox from './components/CaptionBox'
import FeaturesGrid from './components/FeaturesGrid'


function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Add a small delay for smooth animation
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-tertiary animate-gradient transition-colors duration-500"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(30,64,175,0.3)_1px,transparent_0)] [background-size:20px_20px] animate-pulse-slow"></div>
      </div>

      <div className={`transition-all duration-1000 pt-16 lg:pt-20 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-12 max-w-7xl">
          {/* Header */}
          <header className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-20 h-20 bg-gradient-to-r from-primary-400 to-secondary-500 dark:from-primary-300 dark:to-secondary-400 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
            
            <div className="relative z-10">              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-400 bg-clip-text text-transparent animate-gradient">
                  {appConfig.name}
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-600 dark:text-dark-text-secondary max-w-3xl mx-auto leading-relaxed mb-8 animate-slide-up">
                {appConfig.description}{' '}
                <span className="font-semibold text-slate-800 dark:text-dark-text-primary">Fast, secure, and completely browser-based</span>{' '}
                - no uploads to servers required.
              </p>
            </div>
          </header>

          {/* How to Use Section (now with 4 steps) */}
          <section className="mb-12 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass-morphism rounded-3xl p-8 max-w-4xl mx-auto bg-white/10 dark:bg-dark-bg-secondary/20 backdrop-blur-md border border-white/20 dark:border-dark-border-primary">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-dark-text-primary mb-6">
                How to Use {organizationConfig.shortName} Frame Editor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 dark:from-primary-400 dark:to-secondary-500 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Upload Images</h3>
                  <p className="text-sm text-slate-500 dark:text-dark-text-secondary">
                    Add your background photo and transparent PNG frame. Files are processed locally in your browser.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-accent-600 dark:from-secondary-400 dark:to-accent-500 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Edit & Adjust</h3>
                  <p className="text-sm text-slate-500 dark:text-dark-text-secondary">
                    Use controls to adjust brightness, contrast, zoom, and position. Real-time preview shows changes instantly.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-400 dark:from-primary-500 dark:to-accent-300 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Download</h3>
                  <p className="text-sm text-slate-500 dark:text-dark-text-secondary">
                    Export your final image in Full HD quality (1920×1080) or higher resolution formats.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-600 to-primary-400 dark:from-accent-500 dark:to-primary-300 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Copy Caption</h3>
                  <p className="text-sm text-slate-500 dark:text-dark-text-tertiary">
                    Paste this as your profile caption when you share your BUCC frame photo!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Editor */}
          <main className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <ImageEditor />
          </main>

          {/* Bit Battles Section */}
          <CaptionBox />

          {/* Features Grid */}
          <FeaturesGrid />
          
                    {/* Footer */}
                    <Footer />
        </div>
      </div>
    </div>
  )
}

export default App