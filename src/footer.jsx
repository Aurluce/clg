export default function Footer(){


    return(
        
        <div className="bg-[#0f172a] text-gray-300 pt-12 pb-6 ">
            
            <div className="grid grid-cols-4  ml-3 max-[900px]:hidden">
                <div className="flex flex-col gap-2">
                   <div className="flex">
                    <img src="" alt="logo" />
                    <div className="text-white font-bold"> Church of The  living God</div>
                   </div>
                   <p className="text-xs">Au centre de la perfection des ames dans le monde entier</p>
                   <img src="" alt="logo social" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-white font-bold">Liens rapides</div>
                    <div className="flex flex-col text-xs gap-2">
                        <div className="">Acceuil</div>
                     <div className="">Nos offres</div>
                      <div className="">A propos</div>
                       <div className="">Blog</div>
                       <div className="">Contact</div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-white font-bold">Support</div>
                    <div className="flex flex-col text-xs gap-2">
                        <div className="">Centre d'aide</div>
                    <div className="flex">
                        <img src="" alt="logo" />
                      <div className="">Email : clg@gmail.com</div>
                     
                    </div>
                     <div className="flex">
                        <img src="" alt="logo" />
                     <div className="">Tel : +237 683902407</div>
                     </div>
                       <div className="">Blog</div>
                       <div className="">Contact</div>
                    </div>
                </div>
                 <div className="flex flex-col gap-3">
                    <div className=" font-bold">Newsletter</div>
                    <div className="text-xs"> 
                        <p>Recevez nos informations</p>
                    <div>
                        <input type="email" className="bg-[#3F3A42] p-1" placeholder="votre email" />
                        <button className="bg-blue-700 font-bold p-1">OK</button>
                    </div>
                    </div>
                 </div>
            </div>


             <div className="grid grid-cols-3  ml-3 min-[900px]:hidden ">
                

                <div className="flex flex-col gap-2">
                    <div className="text-white font-bold">Liens rapides</div>
                    <div className="flex flex-col text-xs gap-2">
                        <div className="">Acceuil</div>
                     <div className="">Nos offres</div>
                      <div className="">A propos</div>
                       <div className="">Blog</div>
                       <div className="">Contact</div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-white font-bold">Support</div>
                    <div className="flex flex-col text-xs gap-2">
                        <div className="">Centre d'aide</div>
                    <div className="flex">
                        <img src="" alt="logo" />
                      <div className="">Email : clg@gmail.com</div>
                     
                    </div>
                     <div className="flex">
                        <img src="" alt="logo" />
                     <div className="">Tel : +237 683902407</div>
                     </div>
                       <div className="">Blog</div>
                       <div className="">Contact</div>
                    </div>
                </div>
                 <div className="flex flex-col gap-3">
                    <div className=" font-bold">Newsletter</div>
                    <div className="text-xs"> 
                        <p>Recevez nos informations</p>
                    <div >
                        <input type="email" className="bg-[#3F3A42] p-1 " placeholder="votre email" />
                        <button className="bg-blue-700 font-bold p-1 mt-3">OK</button>
                    </div>
                    </div>
                 </div>
            </div>
            
                <div className="bg-slate-600 w-full h-[0.5px] mt-2"></div>
                <div className=" flex min-[900px]:gap-[600px] mt-5 gap-250px">
                    <p className="text-xs">© Copyrigth CLG 2026</p>
                    <div className="flex items-end justify-end text-end ">
                        <div className="text-xs" >Mentions legales | </div>
                        <div className="text-xs ml-1"> Politique de confidentialte</div>
                    </div>
                </div>
            
        </div>
    )
}