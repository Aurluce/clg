import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthCreate1 from './authentification/Auth-create1.jsx'
import AuthCreate3 from './authentification/Auth-create3.jsx'
import Navbar from './brouillon.jsx'


import AuthCon2 from './authentification/Auth-con2.jsx'
import AuthCreate2 from './authentification/Auth-create2.jsx'
import Entete from './Entete.jsx'
import Footer from './footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Entete />
    <AuthCreate3 />
    <Footer />
  
  </StrictMode>,
)