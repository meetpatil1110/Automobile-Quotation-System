import React from 'react'
import ReactDOM from 'react-dom/client'
import { DealerProvider } from './DealerContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DealerProvider>
      <App />
    </DealerProvider>
  </React.StrictMode>,
)
