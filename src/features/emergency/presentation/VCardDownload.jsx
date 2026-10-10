import { useState } from 'react'
import { Download } from 'lucide-react'
import texts from '@/locales/es.json'
import { selectEmergencyQr } from '@/features/emergency/application/selectEmergencyQr'
import { formatVCardData } from '@/features/emergency/domain/formatVCardData'
import { createPrintableQr } from '@/features/emergency/infrastructure/createPrintableQr'
import { exportQrPdf } from '@/features/emergency/infrastructure/exportQr'
import { downloadImage } from '@/shared/downloadImage'
import { showDownloadToast } from '@/shared/showDownloadToast'

export function VCardDownload({ data, size }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [message, setMessage] = useState('')
  async function download() {
    setIsDownloading(true)
    setMessage('')
    try {
      const qr = await selectEmergencyQr(
        { ...data, notes: '' },
        size,
        createPrintableQr,
        formatVCardData,
      )
      if (!qr.canDownload) {
        setMessage(texts.vcard.tooLong)
        return
      }
      downloadImage(await exportQrPdf(qr, size), `comit-vcard-${size}cm.pdf`)
      if (qr.omitted.length) setMessage(texts.vcard.partial)
      showDownloadToast()
    } catch {
      setMessage(texts.vcard.error)
    } finally {
      setIsDownloading(false)
    }
  }
  return (
    <div className="mt-3 space-y-2">
      <button
        type="button"
        onClick={download}
        disabled={isDownloading}
        aria-busy={isDownloading}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-pink/30 px-3 py-3 text-sm font-semibold disabled:opacity-50"
      >
        <Download size={17} />
        {isDownloading ? texts.export.busy : texts.vcard.download}
      </button>
      <p className="text-xs leading-5 text-muted">{texts.vcard.hint}</p>
      {message && (
        <p
          role="status"
          className="text-xs leading-5 text-amber-800"
        >
          {message}
        </p>
      )}
    </div>
  )
}
