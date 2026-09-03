import { useState } from "react";

function Compteur(){
    const [count, setCount] = useState(0)
    return (
        <div>
            <p>Valeur: {count}</p>
            <button onClick={() => setCount(count + 1)}>Ajouter</button>
            <button onClick={() => setCount(count - 1)}>Soustraire</button>
        </div>
    )
}

export default Compteur;