 import vid1 from "../assets/vid1.mp4"
 import PredicTem from '../predication/predic-tem.jsx'
 import TemPredic from "./tem-predic.jsx";

 export default function VoirTem(){
    

    return(
            <>
          
          <div className="flex gap-2 max-[899px]:flex-col">
            <div>
                <div className="ml-10">
             <video src={vid1} controls></video>

            <div className="mt-15 flex flex-col gap-8">
                  <p>
                    dimanche, 05 septembre 2026
                </p>
                <p>
                    <span className="font-bold uppercase">Adresse:</span> CLG-Maeture,Bafoussam,cameroun
                </p>
               <p className=""> <span className="font-bold uppercase">Autheur </span>: Frere Isac</p>
               
               <p className="mb-6">
                <span className="font-bold uppercase">Sujet:</span> Restauration du domaine des finances 
                </p>     
              
            </div>
          </div>
            </div>
            <TemPredic></TemPredic>
          </div>
            
            
            
            
         
            
            </>



    )
 }