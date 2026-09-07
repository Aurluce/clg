import { useState } from "react";
import Logo from "./logo";
import AuthCon2 from "./Auth-con2";
import AuthCreate2 from "./Auth-create2";
import Entete from "./Entete";
import Titre1 from "./titre1";
export default function AuthCreate1() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState([]); // ex: ["Ces identifiants ne correspondent pas."]
    const [page,setPage] = useState("acceuil")
    if(page === "suivant"){
    return (
      <AuthCreate2 />
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
        // ici tu appelleras ton endpoint Laravel (login.store) via fetch/axios
        console.log(form);
    };

    return (
        <>
            <div className="w-full mx-auto bg-[#f4f6f9] text-[#333333] flex flex-col min-h-screen">

                {/* NAVBAR (inchangée) */}
               <Entete></Entete>

                {/* MAIN */}
                <main className="flex flex-1 items-start justify-center pt-[20px] px-[20px] w-full">
                      <div className="bg-[#ffffff] w-full min-[900px]:max-w-[800px] max-w-[320px] text-center rounded-[12px]
                    px-6 py-8 shadow-[0_10px_30px_rgba(13,71,161,0.08)] transition-shadow duration-300
                    hover:shadow-[0_15px_35px_rgba(13,71,161,0.12)]">

                        
                   <Titre1></Titre1>

                        {/* FORMULAIRE (repris de connex.blade.php) */}
                        <form onSubmit={handleSubmit} className="text-left">

                            {errors.length > 0 && (
                                <div className="mb-3 text-red-600 text-sm space-y-1">
                                    {errors.map((err, i) => (
                                        <p key={i}>{err}</p>
                                    ))}
                                </div>
                            )}

                            <div className="mb-5">
                                <label
                                    htmlFor="email"
                                    className="block text-sm text-[#757575] font-medium mb-2"
                                >
                                    Adresse e-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="@mail.com"
                                    required
                                    className="w-full px-2 py-1 text-[12px] rounded-[18px]
                                    border-[1.5px] border-[#e0e0e0] bg-[#fafafa] text-[#333333]
                                    outline-none transition-all duration-300
                                    focus:border-[#0d47a1] focus:bg-white
                                    focus:shadow-[0_0_0_4px_rgba(13,71,161,0.1)]"
                                />
                            </div>

                            <div className="mb-5">
                                <label
                                    htmlFor="password"
                                    className="block text-sm text-[#757575] font-medium mb-2"
                                >
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Saisissez votre mot de passe"
                                    required
                                    className="w-full px-2 py-1 text-[12px] rounded-[18px]
                                    border-[1.5px] border-[#e0e0e0] bg-[#fafafa] text-[#333333]
                                    outline-none transition-all duration-300
                                    focus:border-[#0d47a1] focus:bg-white
                                    focus:shadow-[0_0_0_4px_rgba(13,71,161,0.1)]"
                                />
                            </div>

                             <div className="mb-5">
                                <label
                                    htmlFor="password"
                                    className="block text-sm text-[#757575] font-medium mb-2"
                                >
                                   Confirmer votre Mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder=" Confirmer votre Mot de passe"
                                    required
                                    className="w-full px-2 py-1 text-[12px] rounded-[18px]
                                    border-[1.5px] border-[#e0e0e0] bg-[#fafafa] text-[#333333]
                                    outline-none transition-all duration-300
                                    focus:border-[#0d47a1] focus:bg-white
                                    focus:shadow-[0_0_0_4px_rgba(13,71,161,0.1)]"
                                />
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
                                page 1/3
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
