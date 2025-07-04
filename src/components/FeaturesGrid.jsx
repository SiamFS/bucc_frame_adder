import { SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const FeaturesGrid = () => (
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
          <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Export in multiple resolutions up to 4K</p>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
