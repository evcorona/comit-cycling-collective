import { CardDownload } from '@/features/emergency/presentation/CardDownload'
import clsx from 'clsx'
import { QrDownload } from '@/features/emergency/presentation/QrDownload'
import texts from '@/locales/es.json'
import { QrCode, Download, WifiOff } from 'lucide-react'
export function QrResult({ result }) {
  return (
    <section
      className="overflow-hidden rounded-xl border border-stone-200 bg-white"
      aria-label={texts.qrResult.regionLabel}
      aria-live="polite"
    >
      <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
        <h3 className="font-bold text-black">{texts.common.qrTitle}</h3>
        <span
          className={clsx(
            'rounded-full px-2.5 py-1 text-[10px] font-semibold',
            result ? 'bg-pink/10 text-black' : 'bg-cream text-muted',
          )}
        >
          {result ? texts.qrResult.ready : texts.qrResult.preview}
        </span>
      </div>
      <div className="px-6 py-7 text-center">
        {result ? (
          <>
            <img
              src={result.image}
              alt={texts.qrResult.imageAlt}
              className="mx-auto aspect-square w-60 max-w-full"
            />
            <h4 className="mt-3 font-bold text-black">{result.data.name}</h4>
            <p className="mt-2 text-xs leading-5 text-muted">
              {texts.qrResult.scanHint}
            </p>
            <QrDownload
              key={result.image}
              text={result.encodedText}
            />
            <CardDownload
              key={result.image}
              result={result}
            />
            <details className="mt-5 text-left">
              <summary className="cursor-pointer text-xs font-semibold text-black">
                {texts.qrResult.review}
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
              {texts.qrResult.emptyTitle}
            </h4>
            <p className="mx-auto mt-2 max-w-64 text-xs leading-6 text-muted">
              {texts.qrResult.emptyDescription}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted">
              <Download size={14} />
              {texts.qrResult.format}
            </div>
          </>
        )}
        <div className="mt-5 rounded-lg bg-cream p-3 text-xs leading-5 text-muted">
          <p className="flex items-center justify-center gap-2 font-semibold text-black">
            <WifiOff size={15} />
            {texts.qrResult.offlineTitle}
          </p>
          <p className="mt-1">{texts.qrResult.offlineDescription}</p>
        </div>
      </div>
    </section>
  )
}
