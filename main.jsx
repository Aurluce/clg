import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthCreate1 from './Auth-create1.jsx'
import AuthCreate3 from './Auth-create3.jsx'

import AuthCon2 from './Auth-con2.jsx'
import AuthCreate2 from './Auth-create2.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
