import { useState } from "react";
import Logo from "./logo";
import AuthCreate3 from "./Auth-create3";

export default function AuthCreate2() {
    const [form, setForm] = useState({ nom: "", prenom: "", dateNais: "", lieuNais: "",sexe: "" });
    const [errors, setErrors] = useState([]); // ex: ["Ces identifiants ne correspondent pas."]
    const [page,setPage] = useState("acceuil")
        if(page === "suivant"){
        return (
          <AuthCreate3 />
        );
      } 
      else if(page === "connecter"){
        return (AuthCon2)
      }
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // ici tu appelleras ton endpoint Laravel via fetch/axios
        console.log(form);
    };

    // les "name" ici doivent être IDENTIQUES aux clés du useState ci-dessus
    const champ = [
        {
            title: "Nom",
            id: "nom",
            name: "nom",
            type: "text",
        },
        {
            title: "Prenom",
            id: "prenom",
            name: "prenom",
            type: "text",
        },
        {
            title: "Date de Naissance",
            id: "dateNais",
            name: "dateNais",
            type: "date",
        },
        {
            title: "Lieu de naissance",
            id: "lieuNais",
            name: "lieuNais",
            type: "text",
        },
        {
            title: "sexe",
            id: "sexe",
            name: "sexe",
            type: "radio",
        },
         {
            title: "pays de residence",
            id: "pays",
            name: "pays",
            type: "text",
        },
         {
            title: "Numero de telephone",
            id: "numero",
            name: "numero",
            type: "number",
        },
    ];

    return (
        <>
            <div className="w-full max-w-[400px] mx-auto bg-[#f4f6f9] text-[#333333] flex flex-col min-h-screen">

                {/* NAVBAR (inchangée) */}
                <nav className="bg-blue-600 font-semibold text-[12px]
                flex flex-row items-center justify-between shadow-lg p-2 text-[#ffffff]">
                  <div className="flex gap-1 ">
                                     <div><Logo></Logo></div>
                                      <a href="#" className="logo">
                                         <span className="text-[#ffffff]">Church of the </span>
                                         <span className="text-red-400 font-bold">Living God</span>
                                     </a>
                                    </div>
                    <ul className="flex list-none gap-[1rem]">
                        <li><a href="{{ route('home') }}">Accueil</a></li>
                        <li><a href="#">À propos</a></li>
                        <li><a href="#">Contacts</a></li>
                    </ul>
                </nav>

                {/* MAIN */}
                <main className="flex flex-1 items-start justify-center pt-[20px] px-[20px] w-full">
                    <div className="bg-[#ffffff] w-full max-w-[320px] text-center rounded-[12px]
                    px-6 py-8 shadow-[0_10px_30px_rgba(13,71,161,0.08)] transition-shadow duration-300
                    hover:shadow-[0_15px_35px_rgba(13,71,161,0.12)]">

                        <h1 className="text-xl mb-6">
                            <span className="text-blue-800 font-semibold">Church of the </span>
                            <span className="text-red-400 font-bold">Living God</span>
                        </h1>

                        {/* FORMULAIRE */}
                        <form onSubmit={handleSubmit} className="text-left">

                            {errors.length > 0 && (
                                <div className="mb-3 text-red-600 text-sm space-y-1">
                                    {errors.map((err, i) => (
                                        <p key={i}>{err}</p>
                                    ))}
                                </div>
                            )}

                           <div>
    {champ.map((valeur, index) => (
        <div className="mb-5" key={index}>
            <label
                htmlFor={valeur.id}
                className="block text-sm text-[#757575] font-medium mb-2"
            >
                {valeur.title}
            </label>

            {valeur.title === "sexe" ? (
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name={valeur.name}
                            value="Masculin"
                            checked={form[valeur.name] === "Masculin"}
                            onChange={handleChange}
                            required
                            className="accent-[#0d47a1]"
                        />
                        <span className="mr-[12px]">Masculin</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name={valeur.name}
                            value="Feminin"
                            checked={form[valeur.name] === "Feminin"}
                            onChange={handleChange}
                            required
                            className="accent-[#0d47a1] "
                        />
                          <span className=""> Feminin</span>
                    </label>
                </div>
            ) : (
                <input
                    type={valeur.type}
                    id={valeur.id}
                    name={valeur.name}
                    value={form[valeur.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1 text-[12px] rounded-[18px]
                    border-[1.5px] border-[#e0e0e0] bg-[#fafafa] text-[#333333]
                    outline-none transition-all duration-300
                    focus:border-[#0d47a1] focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(13,71,161,0.1)]"
                />
            )}
        </div>
    ))}
</div>

                            <button
                                type="submit"
                                className="block w-4/5 mx-auto mt-4 py-3 text-white font-medium
                                bg-blue-600 rounded-full shadow-[0_4px_12px_rgba(13,71,161,0.2)]
                                transition-all duration-300
                                hover:bg-[#1565c0] hover:-translate-y-0.5
                                hover:shadow-[0_6px_15px_rgba(13,71,161,0.3)] text-xs"
                              onClick={()=>setPage("suivant")}
                           >
                                Suivant
                            </button>
                        </form>

                        {/* FOOTER DU FORMULAIRE */}
                        <div className="mt-6 text-[0.85rem] text-[#333333]">
                            <a
                                href="{{ route('password.request') }}"
                                className="text-[#0d47a1] font-medium hover:underline"
                            >
                                page 2/3
                            </a>
                            <p className="mt-2">
                                deja inscrit ?{" "}
                                <a
                                    href="{{ route('register') }}"
                                    className="text-[#0d47a1] font-medium hover:underline"
                               onClick={()=>setPage("connecter")}
                               >
                                    Se connecter
                                </a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
