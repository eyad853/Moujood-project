import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enSignupAs from './locales/en/signupAs.json'
import enclientAuth from './locales/en/clientAuth.json'
import enbusinessAuth from './locales/en/businessAuth.json'
import enLogin from './locales/en/login.json'
import enSettings from './locales/en/settings.json'
import enNotification from './locales/en/notification.json'
import enProfile from './locales/en/profile.json'
import enCategories from './locales/en/categories.json'
import enFeed from './locales/en/feed.json'
import enBusinessDashboard from './locales/en/businessDashboard.json'
import enBusinessOffers from './locales/en/businessOffers.json'
import enCommentsSheet from './locales/en/commentsSheet.json'
import enEditProfileSheet from './locales/en/editProfileSheet.json'
import enOfferDetailsSheet from './locales/en/offerDetailsSheet.json'
import enOfferSheet from './locales/en/offerSheet.json'
import enPasswordEditSheet from './locales/en/passwordEditSheet.json'
import enVerifyEmail from './locales/en/verify_email.json'


import arSignupAs from './locales/ar/signupAs.json'
import arclientAuth from './locales/ar/clientAuth.json'
import arbusinessAuth from './locales/ar/businessAuth.json'
import arLogin from './locales/ar/login.json'
import arSettings from './locales/ar/settings.json'
import arNotification from './locales/ar/notification.json'
import arProfile from './locales/ar/profile.json'
import arCategories from './locales/ar/categories.json'
import arFeed from './locales/ar/feed.json'
import arBusinessDashboard from './locales/ar/businessDashboard.json'
import arBusinessOffers from './locales/ar/businessOffers.json'
import arCommentsSheet from './locales/ar/commentsSheet.json'
import arEditProfileSheet from './locales/ar/editProfileSheet.json'
import arOfferDetailsSheet from './locales/ar/offerDetailsSheet.json'
import arOfferSheet from './locales/ar/offerSheet.json'
import arPasswordEditSheet from './locales/ar/passwordEditSheet.json'
import arVerifyEmail from './locales/ar/verify_email.json'




i18n
.use(LanguageDetector)// auto-detect user language
.use(initReactI18next)// connect with React
.init({
    resources:{
        ar:{
            signupAs:arSignupAs,
            clientAuth:arclientAuth,
            businessAuth:arbusinessAuth,
            login:arLogin,
            settings:arSettings,
            notification:arNotification,
            profile:arProfile,
            categories:arCategories,
            feed:arFeed,
            businessDashboard:arBusinessDashboard,
            businessOffers:arBusinessOffers,
            commentsSheet:arCommentsSheet,
            editProfileSheet:arEditProfileSheet,
            offerDetailsSheet:arOfferDetailsSheet,
            offerSheet:arOfferSheet,
            passwordEditSheet:arPasswordEditSheet,
            verfiyEmail:arVerifyEmail
        },

        en:{
            signupAs:enSignupAs,
            clientAuth:enclientAuth,
            businessAuth:enbusinessAuth,
            login:enLogin,
            settings:enSettings,
            notification:enNotification,
            profile:enProfile,
            categories:enCategories,
            feed:enFeed,
            businessDashboard:enBusinessDashboard,
            businessOffers:enBusinessOffers,
            commentsSheet:enCommentsSheet,
            editProfileSheet:enEditProfileSheet,
            offerDetailsSheet:enOfferDetailsSheet,
            offerSheet:enOfferSheet,
            passwordEditSheet:enPasswordEditSheet,
            verfiyEmail:enVerifyEmail
        }
    },
    fallbackLng:"ar", 
    ns: ['signupAs' , 'clientAuth' , 'businessAuth' , 'login' , 'settings', 'notification' , 'profile' , 'feed' , 'businessDashboard' , 'businessOffers','commentsSheet' , 'editProfileSheet' , 'offerDetailsSheet' , 'offerSheet' , 'passwordEditSheet' , 'verfiyEmail'],
    defaultNS:"signupAs",
    interpolation: { escapeValue: false }
})

export default i18n