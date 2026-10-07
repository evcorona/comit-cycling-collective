import {
  encodeQrImage,
  getQrPrintSizing,
} from '@/features/emergency/infrastructure/qrImage'
import {
  MIN_EXPORT_CM,
  MAX_EXPORT_CM,
  PRINT_DPI,
  printPixels,
} from '@/features/emergency/domain/constants/export'
import { withPngResolution } from '@/shared/pngResolution'
import { loadImage } from '@/shared/loadImage'

export async function exportQr(qr, sizeCm) {
  const { minimumCm } = getQrPrintSizing(qr.text)
  if (
    !Number.isFinite(sizeCm) ||
    sizeCm < Math.max(MIN_EXPORT_CM, minimumCm) ||
    sizeCm > MAX_EXPORT_CM
  )
    throw new Error('QR print size is insufficient')
  const width = printPixels(sizeCm)
  const image = await loadImage(await encodeQrImage(qr.text, width, true))
  const labelHeight = printPixels(0.35)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = width + labelHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas unavailable')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.imageSmoothingEnabled = false
  context.drawImage(
    image,
    Math.floor((width - image.width) / 2),
    Math.floor((width - image.height) / 2),
  )
  context.fillStyle = '#000000'
  context.font = `bold ${printPixels(0.18)}px Arial`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(qr.title, width / 2, width + labelHeight / 2)
  return withPngResolution(canvas.toDataURL('image/png'), PRINT_DPI)
}
