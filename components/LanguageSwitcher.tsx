'use client';

import { useLanguage } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg p-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
          language === 'en'
            ? 'bg-cyan-500 text-black'
            : 'text-white hover:bg-white/10'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('fr')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
          language === 'fr'
            ? 'bg-cyan-500 text-black'
            : 'text-white hover:bg-white/10'
        }`}
      >
        FR
      </button>
    </div>
  );
}
