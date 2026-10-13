import { FaWhatsapp } from "react-icons/fa"
import { SiGmail } from "react-icons/si"

export default function Contact() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-lg font-bold text-indigo-600">Contactez-nous</h2>

      {/* WhatsApp */}
      <a
        href="https://wa.me/237XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nous écrire sur WhatsApp"
        className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-[#68708C] font-semibold transition-all duration-300 hover:bg-green-50 hover:border-green-400"
      >
        <FaWhatsapp size={28} className="text-[#25D366]" />
        WhatsApp
      </a>

      {/* Gmail */}
      <a
        href="mailto:ton.adresse@gmail.com"
        aria-label="Nous écrire par email"
        className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-[#68708C] font-semibold transition-all duration-300 hover:bg-red-50 hover:border-red-400"
      >
        <SiGmail size={28} className="text-[#EA4335]" />
        Gmail
      </a>
    </div>
  )
}