
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "sw";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  detectAndTranslate: (text: string, targetLang?: Language) => Promise<string>;
};

const defaultLanguage = localStorage.getItem("language") as Language || "en";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
  detectAndTranslate: async (text: string) => text,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    localStorage.setItem("language", language);
    
    // Load translations
    const loadTranslations = async () => {
      try {
        const enTranslations = {
          "dashboard": "Dashboard",
          "children": "Children",
          "healthRecords": "Health Records",
          "educationRecords": "Education Records",
          "clothingInventory": "Clothing Inventory",
          "foodInventory": "Food Inventory",
          "donations": "Donations",
          "settings": "Settings",
          "help": "Help & Feedback",
          "logout": "Log out",
          "administrator": "Administrator",
          "manageOrphanage": "Manage every aspect of the orphanage with ease",
          "navigation": "Navigation",
          "language": "Language Settings",
          "speakAnyLanguage": "Speak in any language"
        };
        
        const swTranslations = {
          "dashboard": "Dashibodi",
          "children": "Watoto",
          "healthRecords": "Rekodi za Afya",
          "educationRecords": "Rekodi za Elimu",
          "clothingInventory": "Akiba ya Nguo",
          "foodInventory": "Akiba ya Chakula",
          "donations": "Michango",
          "settings": "Mipangilio",
          "help": "Usaidizi na Maoni",
          "logout": "Toka",
          "administrator": "Msimamizi",
          "manageOrphanage": "Simamia kila kipengele cha nyumba ya yatima kwa urahisi",
          "navigation": "Urambazaji",
          "language": "Mipangilio ya Lugha",
          "speakAnyLanguage": "Ongea kwa lugha yoyote"
        };
        
        setTranslations({
          en: enTranslations,
          sw: swTranslations
        });
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };
    
    loadTranslations();
  }, [language]);
  
  const t = (key: string): string => {
    if (!translations[language]) return key;
    return translations[language][key] || translations["en"][key] || key;
  };
  
  // Enhanced function to detect language and translate text to a specified target language
  const detectAndTranslate = async (text: string, targetLang?: Language): Promise<string> => {
    if (!text) return text;
    
    try {
      // Determine the target language - use the provided one or fall back to the app's current language
      const finalTargetLang = targetLang || language;
      
      // In a real application, we would use a more sophisticated language detection
      // For demonstration purposes, we'll use a simple heuristic to detect languages
      const swahiliWords = [
        "jambo", "habari", "asante", "karibu", "ndiyo", "hapana", "tafadhali",
        "kwaheri", "mzuri", "mbaya", "jina", "nani", "wapi", "lini", "kwa", "na"
      ];
      
      // Count how many known Swahili words are in the text
      const words = text.toLowerCase().split(/\s+/);
      const swahiliWordCount = words.filter(word => 
        swahiliWords.includes(word.replace(/[,.?!;:]/g, ''))
      ).length;
      
      // If more than 20% of the words are recognized Swahili words, consider it Swahili
      const detectedLanguage = swahiliWordCount > 0 && (swahiliWordCount / words.length) > 0.2 ? "sw" : "en";
      
      console.log("Language detection:", { 
        text, 
        detectedLanguage, 
        targetLanguage: finalTargetLang,
        swahiliWordCount, 
        totalWords: words.length 
      });
      
      // Only translate if the detected language is different from the target language
      if (detectedLanguage !== finalTargetLang) {
        if (detectedLanguage === "sw" && finalTargetLang === "en") {
          // Swahili to English translation would happen here
          // This is a mock implementation - in a real app, you'd call a translation API
          console.log("Translating from Swahili to English:", text);
          return `[Translated from Swahili]: ${text}`;
        } else if (detectedLanguage === "en" && finalTargetLang === "sw") {
          // English to Swahili translation
          console.log("Translating from English to Swahili:", text);
          return `[Imetafsiriwa kutoka Kiingereza]: ${text}`;
        }
      }
      
      return text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, detectAndTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
};
