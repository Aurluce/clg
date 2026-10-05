import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthCreate1 from './authentification/Auth-create1.jsx'
import AuthCreate3 from './authentification/Auth-create3.jsx'
import Navbar from './brouillon.jsx'
import MenuCardsGrid from './MenuCardsGrid.jsx'
import Bafoussam from './chapellesCLG/Bafoussam.jsx'
import AuthCon2 from './authentification/Auth-con2.jsx'
import AuthCreate2 from './authentification/Auth-create2.jsx'
import Entete from './Entete.jsx'
import Footer from './footer.jsx'
import CalvinoBackground from './CalvinoBackground.jsx'
import CLGPage from './convention/CLGPage.jsx'
import FormTem from './Temoignage/FormTem.jsx'
import FormPredic from './predication/FormPredic.jsx'
import RecruiterDashboard from './RecruiterDashboard.jsx'
import RecruiterDashboard3 from './Temoignage/TemDashboard.jsx'
import PredicationDashboard from './predication/PredicationDashboard.jsx'
import TemPredic from './Temoignage/tem-predic.jsx'
import TemoignagesPage from './Temoignage/TemoignagesPage.jsx'
import MyTestimony from './Temoignage/FormTem2.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
    <App />
    </BrowserRouter>
   
    <Footer />
  
  </StrictMode>,
)

