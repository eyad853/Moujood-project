import 'leaflet/dist/leaflet.css'; // Leaflet styles
import './leafletFix.js';           // Fix default marker icons
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AccountProvider } from './context/userContext.jsx'
import Modal from 'react-modal'

Modal.setAppElement('#root');


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccountProvider>
      <App />
    </AccountProvider>
  </StrictMode>,
)
