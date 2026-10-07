import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { QrCode, CreditCard, WifiOff } from 'lucide-react'
import { CardDownload } from '@/features/emergency/presentation/CardDownload'
import { QrDownload } from '@/features/emergency/presentation/QrDownload'
import texts from '@/locales/es.json'

export function QrResult({ result }) {
  const headingRef = useRef(null)
  const [downloadType, setDownloadType] = useState('qr')
  const qr = result?.qr
  useEffect(() => {
    if (result && window.innerWidth < 1024) {
      headingRef.current?.focus({ preventScroll: true })
      headingRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      })
    }
  }, [result])
  return (
    <section
      className={clsx(
        'min-w-0 rounded-2xl border border-black/10 bg-white p-4 sm:p-6',
        { 'hidden lg:block': !result },
      )}
      aria-label={texts.qrResult.regionLabel}
    >
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="scroll-mt-5 text-lg font-bold outline-none"
      >
        {result ? texts.qrResult.ready : texts.qrResult.preview}
      </h2>
      {result ? (
        <>
          <p className="break-words text-center font-semibold">
            {result.data.name}
          </p>
          {downloadType === 'qr' && (
            <p className="mt-1 text-center text-xs leading-5 text-muted">
              {texts.qrResult.scanHint}
            </p>
          )}
          <div
            className="my-5 grid grid-cols-2 gap-2"
            role="group"
            aria-label={texts.qrResult.downloadType}
          >
            {[
              ['qr', QrCode, texts.qrResult.qrOption],
              ['card', CreditCard, texts.qrResult.cardOption],
            ].map(([value, Icon, label]) => (
              <button
                type="button"
                key={value}
                aria-pressed={downloadType === value}
                onClick={() => setDownloadType(value)}
                className={clsx(
                  'flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold',
                  downloadType === value
                    ? 'border-pink bg-pink/5 text-black'
                    : 'border-black/15 text-muted',
                )}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </div>
          <div hidden={downloadType !== 'qr'}>
            <QrDownload
              key={qr.text}
              qr={qr}
            />
          </div>
          {downloadType === 'card' && (
            <CardDownload
              key={qr.text}
              result={result}
            />
          )}
          <details className="mt-5 border-t border-black/10 pt-3">
            <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold">
              {texts.qrResult.review}
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-cream p-3 font-sans text-sm leading-6">
              {qr.text}
            </pre>
          </details>
          <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
            <WifiOff size={14} />
            {texts.qrResult.offlineTitle}
          </p>
        </>
      ) : (
        <div className="py-8 text-center">
          <QrCode
            size={72}
            className="mx-auto mb-4 text-black/15"
          />
          <p className="text-sm leading-6 text-muted">
            {texts.qrResult.emptyDescription}
          </p>
        </div>
      )}
    </section>
  )
}
