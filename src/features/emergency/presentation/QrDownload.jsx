import { useState } from 'react'
import clsx from 'clsx'
import { Download } from 'lucide-react'
import texts from '@/locales/es.json'
import { QrLabelPreview } from '@/features/emergency/presentation/QrLabelPreview'
import {
  exportQrPdf,
  exportQrSvg,
} from '@/features/emergency/infrastructure/exportQr'
import { showDownloadToast } from '@/shared/showDownloadToast'
import { downloadImage } from '@/shared/downloadImage'

export function QrDownload({ qrBySize }) {
  const [size, setSize] = useState(3)
  const qr = qrBySize[size]
  const [isExporting, setIsExporting] = useState(false)
  const [isSheetExporting, setIsSheetExporting] = useState(false)
  const canExportSheet = Object.values(qrBySize).every(
    (item) => item.canDownload,
  )
  const [error, setError] = useState('')
  async function download(format) {
    if (!qr.canDownload) return
    setIsExporting(true)
    setError('')
    try {
      const blob =
        format === 'svg'
          ? await exportQrSvg(qr, size)
          : await exportQrPdf(qr, size)
      downloadImage(blob, `comit-${qr.id}-${size}cm.${format}`)
      showDownloadToast()
    } catch {
      setError(texts.qr.exportError)
    } finally {
      setIsExporting(false)
    }
  }
  async function downloadSheet() {
    setIsSheetExporting(true)
    setError('')
    try {
      const { exportQrSheet } =
        await import('@/features/emergency/infrastructure/exportQrSheet')
      downloadImage(await exportQrSheet(qrBySize), 'comit-plantilla-carta.pdf')
      showDownloadToast()
    } catch {
      setError(texts.sheet.error)
    } finally {
      setIsSheetExporting(false)
    }
  }
  return (
    <div className="space-y-4 text-left">
      <QrLabelPreview
        qr={qr}
        size={size}
      />
      <div
        className={clsx(
          'qr-controls space-y-2 rounded-xl border p-3 text-sm leading-6',
          qr.canDownload && qr.omitted.length === 0
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : 'border-amber-200 bg-amber-50 text-amber-900',
        )}
        role="status"
        aria-live="polite"
      >
        <p>
          {qr.canDownload && qr.omitted.length === 0
            ? texts.export.allIncluded
            : texts.export.sizeHint}
        </p>
        {!qr.canDownload ? (
          <p className="font-semibold">{texts.export.basicTooLong}</p>
        ) : (
          qr.omitted.length > 0 && (
            <p className="font-semibold">
              {size === 6
                ? texts.export.resumeOnly
                : texts.export.increaseOrResume}
            </p>
          )
        )}
      </div>
      <fieldset
        className="qr-controls"
        disabled={isExporting || isSheetExporting}
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
          }}
        />
        <div className="flex justify-between text-xs text-muted">
          <span>{texts.export.minSize}</span>
          <span>{texts.export.maxSize}</span>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted">
          {texts.export.labelSizeHint}
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
            ['pdf', texts.export.download],
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
        <button
          type="button"
          onClick={downloadSheet}
          disabled={!canExportSheet || isSheetExporting}
          aria-busy={isSheetExporting}
          className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-black/15 px-3 py-3 text-sm font-semibold disabled:opacity-50"
        >
          <Download size={17} />
          {isSheetExporting ? texts.export.busy : texts.sheet.download}
        </button>
        {!canExportSheet && (
          <p className="mt-2 text-xs text-muted">{texts.sheet.blocked}</p>
        )}
      </fieldset>
      <details className="qr-controls min-w-0 border-t border-black/10 pt-3">
        <summary className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 py-3 text-sm font-semibold">
          {texts.export.qrDataTitle}
        </summary>
        <pre className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-cream p-3 font-sans text-sm leading-6 [overflow-wrap:anywhere]">
          {qr.displayText ?? qr.text}
        </pre>
      </details>
    </div>
  )
}
