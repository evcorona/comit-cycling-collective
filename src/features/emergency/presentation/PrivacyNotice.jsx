import { ShieldCheck } from 'lucide-react'
export function PrivacyNotice() {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-black">
        <ShieldCheck size={18} /> Tu privacidad va primero
      </div>
      <p className="text-xs leading-6 text-black/75">
        No guardamos ni enviamos tu informacion. El QR se genera en tu navegador
        y tus datos se borran al recargar o cerrar la pagina.
      </p>
      <p className="mt-3 border-t border-black/10 pt-3 text-xs leading-5 text-black/75">
        <strong>Compartelo con cuidado:</strong> cualquiera que escanee tu QR
        podra leer la informacion que incluyas. La imagen descargada conserva
        esos datos.
      </p>
    </div>
  )
}
