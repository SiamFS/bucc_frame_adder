import { useState, useEffect } from 'react'
import { SparklesIcon, ShieldCheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import ImageEditor from './components/ImageEditor'
import Navbar from './components/Navbar'
import { organizationConfig, appConfig } from './config/theme'


function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [copiedHashtag, setCopiedHashtag] = useState('')

  useEffect(() => {
    // Add a small delay for smooth animation
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Updated text for Bit Battles
  const bitBattlesText = `Instead of just scrolling past, why not take the challenge thrown by @BUCC? And Code, Compete, Conquer at 𝗕𝗨𝗖𝗖 𝗕𝗶𝘁 𝗕𝗮𝘁𝘁𝗹𝗲𝘀 
🎯 Register now before the slots run out at:
https://bitbattles.bracucc.org
See you at the arena!
#BitBattles #BUCC`

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHashtag('copied')
      setTimeout(() => setCopiedHashtag(''), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

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
                How to Use {organizationConfig.shortName} Frame Editor Pro
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 dark:from-primary-400 dark:to-secondary-500 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Upload Images</h3>
                  <p className="text-slate-600 dark:text-dark-text-secondary text-sm">
                    Add your background photo and transparent PNG frame. Files are processed locally in your browser.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-accent-600 dark:from-secondary-400 dark:to-accent-500 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Edit & Adjust</h3>
                  <p className="text-slate-600 dark:text-dark-text-secondary text-sm">
                    Use Controls to adjust brightness, contrast, zoom, and position. Real-time preview shows changes instantly.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-600 dark:from-accent-400 dark:to-primary-500 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Download</h3>
                  <p className="text-slate-600 dark:text-dark-text-secondary text-sm">
                    Export your final image in Full HD quality (1920×1080) or higher resolution formats.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500 rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Copy Caption</h3>
                  
                  <p className="text-xs text-slate-500 dark:text-dark-text-tertiary">Paste this as your profile caption when you share your BUCC frame photo!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Editor */}
          <main className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <ImageEditor />
          </main>

          {/* Bit Battles Section */}
          <section className="mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="glass-morphism rounded-2xl p-6 max-w-4xl mx-auto bg-white/10 dark:bg-dark-bg-secondary/20 backdrop-blur-md border border-white/20 dark:border-dark-border-primary">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-4 text-center">
                📝 Caption for Your BUCC Frame Post
              </h3>
              
              <div className="flex justify-center">
                <button 
                  className="bg-white/50 dark:bg-dark-bg-tertiary/50 rounded-xl p-4 border border-slate-200 dark:border-dark-border-primary hover:bg-white/70 dark:hover:bg-dark-bg-tertiary/70 transition-all duration-200 cursor-pointer group text-left w-full max-w-2xl"
                  onClick={() => copyToClipboard(bitBattlesText)}
                  title="Click to copy Bit Battles text"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-700 dark:text-dark-text-primary text-sm">
                      Bit Battles
                    </h4>
                    <div className="flex items-center gap-2">
                      {copiedHashtag === 'copied' ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Copied!
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Copy
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-dark-text-secondary leading-relaxed break-words whitespace-pre-line">
                    {bitBattlesText}
                  </p>
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500 dark:text-dark-text-tertiary">
                  💡 Copy this caption and use it with your BUCC frame post on social media!
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                
                <div className="glass-morphism rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/10 dark:bg-dark-bg-secondary/20 backdrop-blur-md border border-white/20 dark:border-dark-border-primary">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-300 dark:to-green-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Privacy First</h3>
                  <p className="text-sm text-slate-600 dark:text-dark-text-secondary">All processing happens locally - your images never leave your device</p>
                </div>
                
                
                <div className="glass-morphism rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/10 dark:bg-dark-bg-secondary/20 backdrop-blur-md border border-white/20 dark:border-dark-border-primary">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 dark:from-accent-300 dark:to-accent-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Professional Quality</h3>
                  <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Export in multiple resolutions up to 4K for professional use</p>
                </div>
              </div>
            </div>
          </section>
          
                    {/* Footer */}
                    <footer className="text-center mt-20 pb-8 animate-fade-in" style={{ animationDelay: '1s' }}>
                      <div className="glass-morphism rounded-2xl p-8 max-w-4xl mx-auto bg-white/10 dark:bg-dark-bg-secondary/20 backdrop-blur-md border border-white/20 dark:border-dark-border-primary">
                        
                        {/* Club Header */}
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-slate-800 dark:text-dark-text-primary mb-2">
                            {organizationConfig.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-dark-text-secondary mb-4 max-w-2xl mx-auto">
                            <strong className="text-primary-600 dark:text-primary-400">Mission:</strong> {organizationConfig.mission}
                          </p>
                        </div>
          
                        {/* Club Activities */}
                        <div className="flex flex-wrap justify-center gap-2 mb-6 text-xs">
                          {organizationConfig.activities.map((activity) => (
                            <span 
                              key={activity}
                              className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
          
                        {/* Contact Links */}
                        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
                          <a 
                            href={organizationConfig.contact.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                          >
                            🌐 Website
                          </a>
                          <a 
                            href={organizationConfig.contact.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                          >
                            📘 Facebook
                          </a>
                          <a 
                            href={organizationConfig.contact.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                          >
                            💼 LinkedIn
                          </a>
                        </div>
          
                        {/* Motto and Copyright */}
                        <div className="border-t border-slate-200 dark:border-dark-border-primary pt-4 text-center">
                          <p className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-2">
                            Upgrade yourself
                          </p>
                          <p className="text-sm text-slate-500 dark:text-dark-text-tertiary">
                            © 2025 BUCC - Empowering creativity through technology
                          </p>
                        </div>
                      </div>
                    </footer>
        </div>
      </div>
    </div>
  )
}

export default App