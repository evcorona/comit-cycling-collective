import { QrCode, Download, Check, WifiOff } from 'lucide-react'
export function QrResult({ result, download, downloaded }) {
  return (
    <section
      className="overflow-hidden rounded-xl border border-stone-200 bg-white"
      aria-label="Resultado del QR"
      aria-live="polite"
    >
      <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
        <h3 className="font-bold text-black">Tu QR de emergencia</h3>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${result ? 'bg-pink/10 text-black' : 'bg-cream text-muted'}`}
        >
          {result ? 'Listo para llevar' : 'Vista previa'}
        </span>
      </div>
      <div className="px-6 py-7 text-center">
        {result ? (
          <>
            <img
              src={result.image}
              alt="Codigo QR con tus datos de emergencia"
              className="mx-auto aspect-square w-60 max-w-full"
            />
            <h4 className="mt-3 font-bold text-black">{result.data.name}</h4>
            <p className="mt-2 text-xs leading-5 text-muted">
              Escanealo para comprobar tus datos antes de salir.
            </p>
            <button
              onClick={download}
              className="primary mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold"
            >
              <Download size={17} /> Descargar QR en PNG
            </button>
            <p className="mt-3 flex items-center justify-center gap-1 text-[11px] text-muted">
              {downloaded ? (
                <>
                  <Check size={13} /> Descarga iniciada
                </>
              ) : (
                'Imagen de alta resolucion · 1200 × 1200 px'
              )}
            </p>
            <details className="mt-5 text-left">
              <summary className="cursor-pointer text-xs font-semibold text-black">
                Revisar los datos incluidos
              </summary>
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-cream p-3 font-sans text-xs leading-6 text-muted">
                {result.text}
              </pre>
            </details>
          </>
        ) : (
          <>
            <div className="qr-placeholder mx-auto flex h-48 w-48 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-cream">
              <QrCode
                size={110}
                strokeWidth={1}
                className="text-stone-300"
              />
            </div>
            <h4 className="mt-6 text-sm font-semibold text-black">
              Tu QR aparecera aqui.
            </h4>
            <p className="mx-auto mt-2 max-w-64 text-xs leading-6 text-muted">
              Genera tu codigo y descargalo para llevarlo contigo.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted">
              <Download size={14} /> Descarga en formato PNG
            </div>
          </>
        )}
        <div className="mt-5 rounded-lg bg-cream p-3 text-xs leading-5 text-muted">
          <p className="flex items-center justify-center gap-2 font-semibold text-black">
            <WifiOff size={15} /> Consulta sin internet
          </p>
          <p className="mt-1">
            Los datos estan dentro del QR. Puedes leerlos con un lector QR sin
            conexion a internet.
          </p>
        </div>
      </div>
    </section>
  )
}
