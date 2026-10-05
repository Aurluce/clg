import { Routes, Route } from "react-router-dom";
import Acceuil from "./Acceuil";
import AuthCreate1 from "./authentification/Auth-create1";
import AuthCreate2 from "./authentification/Auth-create2";
import AuthCreate3 from "./authentification/Auth-create3";
import AuthCon2 from "./authentification/Auth-con2";
import TemoignagesPage from "./Temoignage/TemoignagesPage";
import VoirTem from "./Temoignage/voir-tem";
import CLGPage from "./convention/CLGPage";
import FormTem from "./Temoignage/FormTem";
import FormPredic from "./predication/FormPredic";
import DashboardTem from "./Temoignage/DashboardTem";
import PredicationDashboard from "./predication/PredicationDashboard";
import PredicationsPage from "./predication/PredicationsPage";
import VoirPredic from "./predication/voir-predic";
import Bafoussam from "./chapellesCLG/Bafoussam";
import ChurchGrid2 from "./chapellesCLG/Trouver-chap";
import Erreur from "./erreur";


export default function App(){
  return (
   <Routes>
     <Route path="/" element={<Acceuil /> } />
    <Route path="/inscription" element={<AuthCreate1 />} />
    <Route path="create2" element={<AuthCreate2 />} />
    <Route path="create3" element={<AuthCreate3 />} />
    
    <Route path="/connexion" element={<AuthCon2 />} />
    <Route path="temoignages" element={<TemoignagesPage />} />
    <Route path="voir-tem" element={< VoirTem/>} />
    <Route path="convention" element={<CLGPage />} />
    <Route path="formTemoignage" element={<FormTem />} />
    <Route path="formPredication" element={<FormPredic />} />
    <Route path="dashBoard-Temoignage" element={<DashboardTem />} />
    <Route path="dashboard-Predication" element={<PredicationDashboard />} />
    <Route path="PredicationsPage" element={<PredicationsPage />} />
    <Route path="voirPredication" element={<VoirPredic />} />
    <Route path="eglisesCLG" element={<ChurchGrid2 />} />
    <Route path="BafoussamChapelle" element={<Bafoussam />} />
    <Route path="Aucun" element={<Erreur />} />
    
   

   </Routes>
  )
}