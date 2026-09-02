import { useState } from "react";

export default function AuthCreate3() {
    const [form, setForm] = useState({ nom: "", prenom: "", dateNais: "", lieuNais: "",role: "" });
    const [errors, setErrors] = useState([]); // ex: ["Ces identifiants ne correspondent pas."]

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
            title: "ville de votre chapelle",
            id: "ville",
            name: "ville",
            type: "text",
        },
   
        {
            title: "Quartier de votre chapelle",
            id: "Quartier",
            name: "Quartier",
            type: "text",
        },
        {
            title: "Profession",
            id: "Profession",
            name: "Profession",
            type: "Profession",
        },
        {
            title: "Statut marital",
            id: "stat-marital",
            name: "stat-marital",
            type: "radio",
        },
         {
            title: "Annee de nouvelle naissance",
            id: "annee",
            name: "annee",
            type: "annee",
        },
         {
            title: "Selectionner votre role dans l'eglise",
            id: "role",
            name: "role",
            type: "text",
            liste: ["Aucun", "Pasteur", "Ancien", "Choriste", "Diacre", "Instrumentiste","Aspirant"]
        },
    ];

    return (
        <>
            <div className="w-full max-w-[400px] mx-auto bg-[#f4f6f9] text-[#333333] flex flex-col min-h-screen">

                {/* NAVBAR (inchangée) */}
                <nav className="bg-blue-600 font-semibold text-[12px]
                flex flex-row items-center justify-between shadow-lg p-2 text-[#ffffff]">
                    <a href="#" className="logo">
                        <span className="text-[#ffffff]">Church of the </span>
                        <span className="text-red-400 font-bold">Living God</span>
                    </a>
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

            {valeur.title === "Statut marital" ? (
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name={valeur.name}
                            value="Celibataire"
                            checked={form[valeur.name] === "Celibataire"}
                            onChange={handleChange}
                            required
                            className="accent-[#0d47a1]"
                        />
                        <span>Célibataire</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name={valeur.name}
                            value="Marie"
                            checked={form[valeur.name] === "Marie"}
                            onChange={handleChange}
                            required
                            className="accent-[#0d47a1]"
                        />
                        <span>Marié(e)</span>
                    </label>
                </div>
            ) : valeur.liste ? (
                <select
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
                >
                    <option value="">-- Choisir --</option>
                    {valeur.liste.map((option, i) => (
                        <option key={i} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
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
                                page 3/3
                            </a>
                            <p className="mt-2">
                                deja inscrit ?{" "}
                                <a
                                    href="{{ route('register') }}"
                                    className="text-[#0d47a1] font-medium hover:underline"
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
