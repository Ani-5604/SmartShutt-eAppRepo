import { createContext, useState, useContext, useEffect } from 'react';

// Create the LanguageContext
const LanguageContext = createContext();

// Create the LanguageProvider component
const LanguageProvider = ({ children }) => {
  // Retrieve the language from localStorage, default to 'English'
  const storedLanguage = localStorage.getItem('language') || 'English';
  const [language, setLanguage] = useState(storedLanguage);

  // When language changes, store it in localStorage
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang); // Save selected language in localStorage
  };

  // Return the provider with values
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageProvider };

// Custom hook to access language context
export const useLanguage = () => useContext(LanguageContext);
