import { IMaskInput } from 'react-imask'
import { useRef, useState } from 'react'
import { Check, ChevronDown, Download } from 'lucide-react'
import clsx from 'clsx'
import texts from '@/locales/es.json'
import {
  EXPORT_SIZES_CM,
  MIN_EXPORT_CM,
  MAX_EXPORT_CM,
} from '@/features/emergency/domain/constants/export'
import { exportQr } from '@/features/emergency/infrastructure/exportQr'
import { downloadImage } from '@/shared/downloadImage'

export function QrDownload({ text }) {
  const triggerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [size, setSize] = useState('5')
  const [customSize, setCustomSize] = useState('5')
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  async function download() {
    const cm = Number(size === 'custom' ? customSize : size)
    if (!Number.isFinite(cm) || cm < MIN_EXPORT_CM || cm > MAX_EXPORT_CM) {
      setError(texts.export.rangeError)
      return
    }
    setIsExporting(true)
    setError('')
    try {
      const blob = await exportQr(text, cm)
      downloadImage(blob, `comit-qr-emergencia-${cm}cm.png`)
      setDownloaded(true)
      setIsOpen(false)
      triggerRef.current?.focus()
    } catch {
      setError(texts.qr.exportError)
    } finally {
      setIsExporting(false)
    }
  }
  return (
    <div className="mt-5">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="qr-export-options"
        onClick={() => setIsOpen((value) => !value)}
        className="primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold"
      >
        <Download size={17} />
        {texts.export.download}
        <ChevronDown
          size={16}
          className={clsx('transition-transform', { 'rotate-180': isOpen })}
        />
      </button>
      {isOpen && (
        <div
          id="qr-export-options"
          className="mt-2 rounded-lg border border-black/15 p-4 text-left"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsOpen(false)
              triggerRef.current?.focus()
            }
          }}
        >
          <fieldset disabled={isExporting}>
            <legend className="mb-3 text-xs font-semibold">
              {texts.export.size}
            </legend>
            <div className="flex flex-wrap gap-2">
              {[...EXPORT_SIZES_CM.map(String), 'custom'].map((value) => (
                <label
                  key={value}
                  className={clsx(
                    'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs',
                    size === value
                      ? 'border-pink bg-pink/5'
                      : 'border-black/15',
                  )}
                >
                  <input
                    type="radio"
                    name="export-size"
                    value={value}
                    checked={size === value}
                    onChange={() => {
                      setSize(value)
                      setError('')
                    }}
                    className="h-3.5 w-3.5 shrink-0 accent-pink"
                  />
                  <span>
                    {value === 'custom'
                      ? texts.export.custom
                      : texts.export.preset.replace('{size}', value)}
                  </span>
                </label>
              ))}
            </div>
            {size === 'custom' && (
              <div className="mt-3">
                <label
                  htmlFor="custom-export-size"
                  className="mb-1 block text-xs"
                >
                  {texts.export.customLabel}
                </label>
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
                  onAccept={(value) => {
                    setCustomSize(value)
                    setError('')
                  }}
                />
              </div>
            )}
            <p className="mt-3 text-xs leading-5 text-muted">
              {texts.export.description}
            </p>
            {error && (
              <p
                id="export-error"
                role="alert"
                className="mt-2 text-xs text-pink"
              >
                {error}
              </p>
            )}
            <button
              type="button"
              disabled={isExporting}
              onClick={download}
              className="primary mt-3 w-full rounded-lg px-3 py-2.5 text-xs font-bold"
            >
              {isExporting ? texts.export.busy : texts.export.confirm}
            </button>
          </fieldset>
        </div>
      )}
      {downloaded && (
        <p
          role="status"
          className="mt-3 flex items-center justify-center gap-1 text-[11px] text-muted"
        >
          <Check size={13} />
          {texts.export.done}
        </p>
      )}
    </div>
  )
}
