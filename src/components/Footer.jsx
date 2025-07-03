import { organizationConfig } from '../config/theme';

const Footer = () => (
  <footer className="text-center mt-20 pb-8 animate-fade-in" style={{ animationDelay: '1s' }}>
    <div className="glass-morphism rounded-2xl p-8 max-w-4xl mx-auto bg-slate-200 dark:bg-dark-bg-secondary/20 backdrop-blur-md border border-white/20 dark:border-dark-border-primary">
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
);

export default Footer;
