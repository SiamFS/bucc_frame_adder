import { 
  GlobeAltIcon,
  BuildingOfficeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import BuccLogoIcon from '../assets/BUCC_Logo_icon.svg'

const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-dark-bg-secondary/80 backdrop-blur-lg border-t border-slate-200/50 dark:border-dark-border-primary/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="glass-morphism rounded-2xl p-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <img 
                  src={BuccLogoIcon} 
                  alt="BUCC Logo" 
                  className="w-10 h-10 filter brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-dark-text-primary mb-1">
                  BRAC University Computer Club 
                </h3>
                <p className="text-slate-600 dark:text-dark-text-secondary text-lg">
                  Empowering the next generation of tech innovators at BRAC University
                </p>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AcademicCapIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">Mission:</span>
            </div>
            <p className="text-slate-700 dark:text-dark-text-secondary text-lg leading-relaxed">
              To foster technological excellence, innovation, and collaborative learning among students
            </p>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Learning & Development</h4>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li>Programming Workshops</li>
                <li>Tech Talks & Seminars</li>
                <li>Skill Development Programs</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 border border-purple-100 dark:border-purple-800/50">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Innovation & Projects</h4>
              <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-400">
                <li>Open Source Contributions</li>
                <li>Hackathons & Competitions</li>
                <li>Industry Networking Events</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-100 dark:border-green-800/50">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">Community Building</h4>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <li>Peer Learning Sessions</li>
                <li>Mentorship Programs</li>
                <li>Tech Community Events</li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-200 dark:border-dark-border-primary">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <span className="text-sm text-slate-600 dark:text-dark-text-secondary">Connect with us:</span>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  Website
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  📘 Facebook
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  💼 LinkedIn
                </a>
              </div>
            </div>
            <div className="text-sm text-slate-500 dark:text-dark-text-tertiary flex items-center gap-2">
              <BuildingOfficeIcon className="w-4 h-4" />
              © 2025 BRAC University Computer Club - Empowering creativity through technology
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
