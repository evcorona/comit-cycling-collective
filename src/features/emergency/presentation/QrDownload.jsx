import { useState } from 'react'
import { Check, Download } from 'lucide-react'
import texts from '@/locales/es.json'
import { QRCodeGenerator } from '@/components/qr/QRCodeGenerator'
import {
  exportQr,
  exportQrSvg,
} from '@/features/emergency/infrastructure/exportQr'
import { downloadImage } from '@/shared/downloadImage'

export function QrDownload({ qrBySize }) {
  const [size, setSize] = useState(3)
  const qr = qrBySize[size]
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  async function download(format) {
    if (!qr.canDownload) return
    setIsExporting(true)
    setError('')
    try {
      const blob =
        format === 'svg' ? exportQrSvg(qr, size) : await exportQr(qr, size)
      downloadImage(blob, `comit-${qr.id}-${size}cm.${format}`)
      setDownloaded(true)
    } catch {
      setError(texts.qr.exportError)
    } finally {
      setIsExporting(false)
    }
  }
  return (
    <div className="space-y-4 text-left">
      <QRCodeGenerator
        value={qr.text}
        physicalSizeCm={size}
        showPrintStatus={false}
        title={qr.title}
      />
      <div
        className="qr-controls space-y-2 rounded-xl bg-cream p-3 text-sm leading-6"
        role="status"
        aria-live="polite"
      >
        {!qr.canDownload ? (
          <p className="font-semibold text-pink">{texts.export.basicTooLong}</p>
        ) : qr.omitted.length === 0 ? (
          <p>{texts.export.allIncluded}</p>
        ) : (
          <>
            <p>
              {qr.included.length === 0
                ? texts.export.onlyBasic
                : texts.export.basicAndMedical}
            </p>
            <p>
              {texts.export.omittedFields.replace(
                '{fields}',
                qr.omitted
                  .map((field) => texts.fields[field].label.toLowerCase())
                  .join(', '),
              )}
            </p>
            <p className="font-semibold">
              {size === 6
                ? texts.export.resumeOnly
                : texts.export.increaseOrResume}
            </p>
            <p className="text-xs text-muted">{texts.export.cardComplete}</p>
          </>
        )}
      </div>
      <fieldset
        className="qr-controls"
        disabled={isExporting}
      >
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="qr-size"
            className="text-sm font-semibold"
          >
            {texts.export.size}
          </label>
          <output
            htmlFor="qr-size"
            className="font-bold tabular-nums"
          >
            {size} {texts.export.unit}
          </output>
        </div>
        <input
          id="qr-size"
          type="range"
          min={3}
          max={6}
          step="1"
          value={size}
          className="size-slider mt-2"
          aria-valuetext={texts.export.preset.replace('{size}', size)}
          onChange={(event) => {
            setSize(Number(event.target.value))
            setError('')
            setDownloaded(false)
          }}
        />
        <div className="flex justify-between text-xs text-muted">
          <span>{texts.export.minSize}</span>
          <span>{texts.export.maxSize}</span>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          {texts.export.sizeHint}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted">
          {texts.export.description}
        </p>
        {error && (
          <p
            role="alert"
            className="mt-2 text-sm text-pink"
          >
            {error}
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            ['png', texts.export.download],
            ['svg', texts.export.downloadSvg],
          ].map(([format, label]) => (
            <button
              key={format}
              type="button"
              aria-label={texts.export.downloadFile.replace('{format}', label)}
              aria-busy={isExporting}
              disabled={isExporting || !qr.canDownload}
              onClick={() => download(format)}
              className="primary flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold disabled:opacity-50"
            >
              <Download size={17} />
              {isExporting ? texts.export.busy : label}
            </button>
          ))}
        </div>
      </fieldset>
      {downloaded && (
        <p
          role="status"
          className="qr-controls flex items-center gap-2 text-sm text-muted"
        >
          <Check size={16} />
          {texts.export.done}
        </p>
      )}
    </div>
  )
}
