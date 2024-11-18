import i18n from 'i18next';
import { initReactI18next, Translation } from 'react-i18next';

import bs from '../../public/locales/bs'
import en from '../../public/locales/en-US'

const resources = {
    bs: {translation: bs},
    en: {translation: en},
};

i18n.use(initReactI18next).init({
    resources,
    lng:'bs',
    fallbackLng:'en',
    interpolation:{
        escapeValue:false,
    },
});

export default i18n;


