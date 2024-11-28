import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { FefuCryptoProvider } from './context/FefuCryptoContext.jsx'

createRoot(document.getElementById('root')).render(
  <FefuCryptoProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </FefuCryptoProvider>,
)
