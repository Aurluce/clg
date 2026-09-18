import img2 from "../assets/img2.jpg";

export default function Bafoussam() {

const pst = ({nom,children})=>{

}

  return (
    <>
     <div className="bg-[#F6F5F3] max-w-[1280] mx-auto space-y-6
     p-10 border-slate-800 ">
       <img src={img2} className="h-[400px] w-full rounded-2xl max-[900px]:h-100" alt="Bafoussam" />
   
      <div className="bg-white text-slate-600 w-full rounded-2xl mr-12  m-10 min-h-screen">


      
        <div className="min-[900px]:text-[16px] p-7">
          <h1 className="text-[25px] font-bold">Presentation </h1>
          <p>
            en 2013, un vaillant homme de Dieu etait venu en mission a Bafoussam dans le but d'implanter un
            ministere sous la denomination de l'ACP (Assemblee centrale de la pentecote). Il debuta par une cellule de priere,
            puis procede a  l'ouverture d'une chapelle :des lors nait l'ACP de bafoussam.
            en 2021, ce vaillant homme sort de cette denomination, puis fonde par la grace de Dieu "CHURCH OF THE LIVING GOD" sur la 
            base de 1 Timothee 3 : 15.C'est ainsi que l'assemblee maeture fut la 1ere eglise mere de la CLG dans le monde.
            Ce vaillant homme est l'Apotre Beaudelaire Tchouga, leader des eglises CLG.Depuis 2022 jusqu"a nos jours,
            il a confiee la  continuite de sons travail dans  cette chapelle a 3 vaillants homme de Dieu : 
            Le pateur Dieudonnee, le Docteur Sylvain et l'ancien Thierry.
          </p>
          <h1 className="text-[25px] font-bold">Adresse </h1>
         <p> La CLG maeture est situe a Bafoussam, 3e rue apres le fin goudron maeture.</p>
        <h1 className="text-[25px] font-bold mt-10">Nos programmes </h1>
       <div className="flex gap-10">
        <div className="flex-col gap-10">
          <div className="text-[20px]">Jour</div>
          <div>Mardi</div>
          <div>Vendredi</div>
          <div>Dimanche</div>
        </div>
         <div className="flex-col gap-10">
          <div className="text-[20px]">Heure</div>
          <div>17H00</div>
          <div>17H00</div>
          <div>9H00</div>
        </div>
       </div>

       <h1 className="text-[25px] font-bold">Contact des dirigeants </h1>
       <p><span className="font-semibold">
        Pasteur
        </span> Dieudonnee : 683902407 maeture@gmail.com</p>
        <h1 className=" mt-7 text-[25px] font-bold text-blue-500">Hebreux 4 : 16 </h1>
        <p className="italic font-serif">
          " Approchons-nous donc avec assurance du trône de la grâce, afin d'obtenir 
         <br /> miséricorde et de trouver grâce, pour être secourus dans nos besoins. "
        </p>
        </div>
        
      

     </div>
     </div>

    
    </>
  );
}