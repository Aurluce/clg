import { Routes, Route } from "react-router-dom";
import Acceuil from "./Acceuil";
import AuthCreate1 from "./authentification/Auth-create1";

export default function App(){
  return (
   <Routes>
     <Route path="/" element={<Acceuil /> } />
    <Route path="/inscription" element={<AuthCreate1 />} />
   </Routes>
  )
}