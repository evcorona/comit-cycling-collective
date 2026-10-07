import { useState } from 'react'
import { Check, CreditCard, Download } from 'lucide-react'
import texts from '@/locales/es.json'
import { exportEmergencyCard } from '@/features/emergency/infrastructure/exportEmergencyCard'
import { downloadImage } from '@/shared/downloadImage'

export function CardDownload({ result }) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  async function download() {
    setIsExporting(true)
    setError('')
    try {
      const blob = await exportEmergencyCard(result)
      downloadImage(blob, 'comit-tarjeta-emergencia.png')
      setDownloaded(true)
    } catch {
      setError(texts.card.error)
    } finally {
      setIsExporting(false)
    }
  }
  return (
    <div className="space-y-3 text-left">
      <h4 className="flex items-center gap-2 text-sm font-bold">
        <CreditCard
          size={18}
          className="text-pink"
        />
        {texts.card.title}
      </h4>
      <p className="mt-2 text-xs leading-5 text-muted">
        {texts.card.description}
      </p>
      <p className="mt-2 text-xs font-semibold">{texts.card.size}</p>
      <button
        type="button"
        onClick={download}
        disabled={isExporting}
        className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/80"
      >
        <Download size={16} />
        {isExporting ? texts.export.busy : texts.card.download}
      </button>
      <p className="mt-2 text-xs leading-5 text-muted">
        {texts.card.printHint}
      </p>
      {error && (
        <p
          role="alert"
          className="mt-2 text-xs text-pink"
        >
          {error}
        </p>
      )}
      {downloaded && (
        <p
          role="status"
          className="mt-2 flex items-center gap-1 text-xs text-muted"
        >
          <Check size={13} />
          {texts.export.done}
        </p>
      )}
    </div>
  )
}
