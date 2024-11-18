import i18n from 'i18next';
import { initReactI18next, Translation } from 'react-i18next';

const resources = {
    bs:{
        translation:{
            WELCOME:"Dobrodosli na SyncPoint365!",
            TITLE:"SyncPoint365",
        },
    },
    en:{
        translation:{
            WELCOME:"Welcome to SyncPoint365!",
            TITLE:"SyncPoint365",
        },
    },
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


