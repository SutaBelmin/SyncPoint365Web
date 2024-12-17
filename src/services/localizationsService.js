import i18n from 'i18next';
import { initReactI18next} from 'react-i18next';
import Backend from 'i18next-fetch-backend';
 
 
i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    defaultNS: "translation",
    lng: localStorage.getItem("selectedLanguage") || "enUS",
    fallbackLng: "enUS",
    debug: false,
    load: "currentOnly",
    react: {
      useSuspense: true,
    },
    preload: ["enUS", "bs"],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    whitelist: ["enUS", "bs"],
    interpolation: {
      escapeValue: false,
    },
  });

 
export default i18n;
 

