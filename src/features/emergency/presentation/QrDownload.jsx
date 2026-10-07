import { IMaskInput } from 'react-imask'
import { useState } from 'react'
import { Check, Download } from 'lucide-react'
import texts from '@/locales/es.json'
import {
  MIN_EXPORT_CM,
  MAX_EXPORT_CM,
} from '@/features/emergency/domain/constants/export'
import { exportQr } from '@/features/emergency/infrastructure/exportQr'
import { downloadImage } from '@/shared/downloadImage'

export function QrDownload({ text }) {
  const [size, setSize] = useState('3')
  const [customSize, setCustomSize] = useState('5')
  const [isCustom, setIsCustom] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  async function download() {
    const cm = Number(isCustom ? customSize : size)
    if (!Number.isFinite(cm) || cm < MIN_EXPORT_CM || cm > MAX_EXPORT_CM) {
      setError(texts.export.rangeError)
      return
    }
    setIsExporting(true)
    setError('')
    try {
      downloadImage(await exportQr(text, cm), `comit-qr-emergencia-${cm}cm.png`)
      setDownloaded(true)
    } catch {
      setError(texts.qr.exportError)
    } finally {
      setIsExporting(false)
    }
  }
  return (
    <div className="space-y-4 text-left">
      <fieldset disabled={isExporting}>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={isCustom ? 'custom-export-size' : 'qr-size'}
            className="text-sm font-semibold"
          >
            {texts.export.size}
          </label>
          <output
            htmlFor="qr-size"
            className="font-bold tabular-nums"
          >
            {isCustom ? customSize || '—' : size} {texts.export.unit}
          </output>
        </div>
        {isCustom ? (
          <IMaskInput
            id="custom-export-size"
            type="text"
            inputMode="decimal"
            mask={Number}
            scale={1}
            radix="."
            mapToRadix={[',']}
            thousandsSeparator=""
            min={0}
            value={customSize}
            aria-invalid={!!error}
            aria-describedby={error ? 'export-error' : undefined}
            className="mt-3"
            onAccept={(value) => {
              setCustomSize(value)
              setError('')
              setDownloaded(false)
            }}
          />
        ) : (
          <>
            <input
              id="qr-size"
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={size}
              className="size-slider mt-2"
              aria-valuetext={texts.export.preset.replace('{size}', size)}
              onChange={(event) => {
                setSize(event.target.value)
                setError('')
                setDownloaded(false)
              }}
            />
            <div className="flex justify-between text-xs text-muted">
              <span>{texts.export.minSize}</span>
              <span>{texts.export.maxSize}</span>
            </div>
          </>
        )}
        <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={isCustom}
            className="h-4 w-4 shrink-0 accent-pink"
            onChange={(event) => {
              setIsCustom(event.target.checked)
              setError('')
              setDownloaded(false)
            }}
          />
          {texts.export.custom}
        </label>
        <p className="text-xs leading-5 text-muted">
          {texts.export.description}
        </p>
        {Number(isCustom ? customSize : size) < 2 && (
          <p className="mt-2 text-xs leading-5 text-muted">
            {texts.export.smallHint}
          </p>
        )}
        {error && (
          <p
            id="export-error"
            role="alert"
            className="mt-2 text-sm text-pink"
          >
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={isExporting}
          onClick={download}
          className="primary mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"
        >
          <Download size={18} />
          {isExporting ? texts.export.busy : texts.export.download}
        </button>
      </fieldset>
      {downloaded && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-muted"
        >
          <Check size={16} />
          {texts.export.done}
        </p>
      )}
    </div>
  )
}
