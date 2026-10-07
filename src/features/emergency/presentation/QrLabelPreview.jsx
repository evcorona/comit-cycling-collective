import { useEffect, useState } from 'react'
import texts from '@/locales/es.json'
import { qrLabelSvg } from '@/features/emergency/infrastructure/qrLabelSvg'
import { QR_PREVIEW_SIZE } from '@/lib/qr/constants'

export function QrLabelPreview({ qr, size }) {
  const [image, setImage] = useState(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let cancelled = false
    let url
    setImage(null)
    setError(false)
    qrLabelSvg(qr, size)
      .then((svg) => {
        if (cancelled) return
        url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
        setImage(url)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [qr, size])
  return (
    <div
      className="qr-screen flex justify-center"
      style={{ '--qr-preview-size': `${QR_PREVIEW_SIZE}px` }}
    >
      {image ? (
        <img
          className="qr-print"
          data-printable={qr.canDownload}
          src={image}
          alt={texts.export.previewAlt}
          style={{ width: `${size}cm`, height: `${size}cm` }}
        />
      ) : (
        <p
          role="status"
          className="py-6 text-sm text-muted"
        >
          {error ? texts.qr.exportError : texts.export.busy}
        </p>
      )}
    </div>
  )
}
