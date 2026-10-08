import { exportImagePdf } from '@/shared/exportImagePdf'
import {
  CARD_WIDTH_CM,
  CARD_HEIGHT_CM,
} from '@/features/emergency/domain/constants/card'
import { useEffect, useState } from 'react'
import { CreditCard, Download } from 'lucide-react'
import texts from '@/locales/es.json'
import { exportEmergencyCard } from '@/features/emergency/infrastructure/exportEmergencyCard'
import { showDownloadToast } from '@/shared/showDownloadToast'
import { downloadImage } from '@/shared/downloadImage'

export function CardDownload({ result }) {
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let cancelled = false
    let url
    exportEmergencyCard(result)
      .then((blob) => {
        if (cancelled) return
        url = URL.createObjectURL(blob)
        setImage({ blob, url })
      })
      .catch(() => {
        if (!cancelled) setError(texts.card.error)
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [result, attempt])
  async function download() {
    if (!image) {
      setError('')
      setAttempt((value) => value + 1)
      return
    }
    setIsDownloading(true)
    try {
      const page = await exportImagePdf(
        image.blob,
        CARD_WIDTH_CM,
        CARD_HEIGHT_CM * 2,
      )
      downloadImage(page, 'comit-tarjeta-carta.pdf')
      showDownloadToast()
    } catch {
      setError(texts.card.error)
    } finally {
      setIsDownloading(false)
    }
  }
  return (
    <div className="space-y-3 text-left">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        <CreditCard
          size={18}
          className="text-pink"
        />
        {texts.card.title}
      </h3>
      <p className="text-xs leading-5 text-muted">{texts.card.description}</p>
      <p className="text-xs font-semibold">{texts.card.size}</p>
      {image && (
        <img
          src={image.url}
          alt={texts.card.imageAlt}
          className="mx-auto w-full max-w-80 border border-black/10"
        />
      )}
      <button
        type="button"
        onClick={download}
        disabled={isDownloading || (!image && !error)}
        aria-busy={isDownloading}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-50"
      >
        <Download size={16} />
        {isDownloading
          ? texts.export.busy
          : error
            ? texts.card.retry
            : !image
              ? texts.export.busy
              : texts.card.download}
      </button>
      <p className="text-xs leading-5 text-muted">{texts.card.printHint}</p>
      {error && (
        <p
          role="alert"
          className="text-xs text-pink"
        >
          {error}
        </p>
      )}
    </div>
  )
}
