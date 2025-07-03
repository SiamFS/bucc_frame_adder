const FeaturesGrid = () => (
  <section className="mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <div className="glass-morphism rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/10 dark:bg-dark-bg-secondary/20 backdrop-blur-md border border-white/20 dark:border-dark-border-primary">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-300 dark:to-green-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Privacy First</h3>
          <p className="text-sm text-slate-600 dark:text-dark-text-secondary">All processing happens locally - your images never leave your device</p>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/10 dark:bg-dark-bg-secondary/20 backdrop-blur-md border border-white/20 dark:border-dark-border-primary">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 dark:from-accent-300 dark:to-accent-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M6.364 6.364l-1.06 1.06M3 12h1.5m13.636-5.636l1.06 1.06M21 12h-1.5m-7.5 7.5V21m5.636-2.364l1.06-1.06M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"></path></svg>
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-dark-text-primary mb-2">Professional Quality</h3>
          <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Export in multiple resolutions up to 4K for professional use</p>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
