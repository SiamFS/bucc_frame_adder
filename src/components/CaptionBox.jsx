import { useState } from 'react';

const bitBattlesText = `Instead of just scrolling past, why not take the challenge thrown by @BUCC? And Code, Compete, Conquer at 𝗕𝗨𝗖𝗖 𝗕𝗶𝘁 𝗕𝗮𝘁𝘁𝗹𝗲𝘀 
🎯 Register now before the slots run out at:
https://bitbattles.bracucc.org
See you at the arena!
#BitBattles #BUCC`;

const CaptionBox = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bitBattlesText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <section className="mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }} id="caption-section">
      <div className="glass-morphism rounded-2xl p-6 max-w-4xl mx-auto bg-slate-200 dark:bg-dark-bg-secondary/20 backdrop-blur-md border border-white/20 dark:border-dark-border-primary">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-4 text-center">
          📝 Caption for Your BUCC Frame Post
        </h3>
        <div className="flex justify-center">
          <button
            className="bg-white/50 dark:bg-dark-bg-tertiary/50 rounded-xl p-4 border border-slate-200 dark:border-dark-border-primary hover:bg-white/70 dark:hover:bg-dark-bg-tertiary/70 transition-all duration-200 cursor-pointer group text-left w-full max-w-2xl"
            onClick={copyToClipboard}
            title="Click to copy Bit Battles text"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-700 dark:text-dark-text-primary text-sm">
                Bit Battles
              </h4>
              <div className="flex items-center gap-2">
                {copied ? (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Copied!</span>
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Copy</span>
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
  );
};

export default CaptionBox;
