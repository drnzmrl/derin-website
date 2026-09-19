import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { applyTheme } from './config/applyTheme'
import { site } from './config/site.config'

// theme.config.js → CSS değişkenleri (ilk boyamadan önce)
applyTheme()

// Sekme başlığı ve açıklaması da site.config.js'ten gelir
document.title = site.meta.title
document
  .querySelector('meta[name="description"]')
  ?.setAttribute('content', site.meta.description)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
