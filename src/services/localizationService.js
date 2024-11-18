import i18n from 'i18next';
import { initReactI18next} from 'react-i18next';
import Backend from 'i18next-fetch-backend';


i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    defaultNS: "translation",
    lng: "en-US",
    fallbackLng: "en-US",
    debug: false,
    load: "currentOnly",
    react: {
      useSuspense: true,
    },
    preload: ["en-US", "bs"],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    whitelist: ["en-US", "bs"],
    interpolation: {
      escapeValue: false,
    },
  });

