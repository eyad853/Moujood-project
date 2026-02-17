import 'leaflet/dist/leaflet.css'; // Leaflet styles
import './leafletFix.js';           // Fix default marker icons
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AccountProvider } from './context/userContext.jsx'
import Modal from 'react-modal'
import i18n from './i18n.js';
import { I18nextProvider } from "react-i18next";

Modal.setAppElement('#root');


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <AccountProvider>
        <App />
      </AccountProvider>
    </I18nextProvider>
  </StrictMode>,
)
