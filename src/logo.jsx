import logoImage from "./assets/image.jpg"

export default function Logo(){
    return(
        <img src={logoImage} className="w-7 h-7 rounded-full flex items-center justify-center "
               alt="" />
    )
}