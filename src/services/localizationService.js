import i18n from 'i18next';
import { initReactI18next} from 'react-i18next';
import Backend from 'i18next-fetch-backend';


i18n
.use(Backend)
.use(initReactI18next)
.init({
  backend:{
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  },
  defaultNS:'translation',
  lng: 'bs',
  fallbackLng:'en',
  interpolation:{
    escapeValue: false,
  },
  load:'currentOnly',
});

export default i18n;


