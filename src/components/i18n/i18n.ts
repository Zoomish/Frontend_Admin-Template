import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from './locales/en.json'
import translationRU from './locales/ru.json'
import translationKZ from './locales/kz.json'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n.use(initReactI18next).init({
  resources: {
    EN: {
      translation: translationEN
    },
    RU: {
      translation: translationRU
    },
    KZ: {
      translation: translationKZ
    }
  },
  lng: 'RU',
  fallbackLng: 'RU',

  interpolation: {
    escapeValue: false
  }
})

export default i18n
