import * as SecureStore from 'expo-secure-store';
import { I18n } from "i18n-js";
import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../infoutils/translations";

type Language = 'es' | 'en';
type LanguageContextProps = {
    language: Language;
    changeLanguage: (lng: Language) => void;
    t: (key: string) => string;
}

const safeTranslations = translations || { en: {}, es: {} };
const i18n = new I18n(safeTranslations);
i18n.defaultLocale = "es";
i18n.enableFallback = true;

const LanguageContext = createContext<LanguageContextProps | null>(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage debe usarse dentro de LanguageProvider");
    return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>("es");

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storedLanguage = await SecureStore.getItemAsync("language");
                if (storedLanguage === 'es' || storedLanguage === 'en') {
                    setLanguage(storedLanguage as Language);
                    i18n.locale = storedLanguage;
                } else {
                    i18n.locale = "es";
                }
            } catch (error) {
                console.log('Error loading language:', error);
                i18n.locale = "es";
            }
        };
        loadLanguage();
    }, []);

    const changeLanguage = async (lng: Language) => {
        setLanguage(lng);
        i18n.locale = lng;
        try {
            await SecureStore.setItemAsync("language", lng);
        } catch (error) {
            console.log('Error saving language:', error);
        }
    };

    const t = (key: string) => i18n.t(key);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export { i18n };