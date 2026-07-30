import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterSetup from './RouterSetup'
import "@fontsource/inter";
import "./i18n";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <RouterSetup />
  </GoogleOAuthProvider>
)
