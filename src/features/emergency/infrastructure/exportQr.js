import { qrLabelSvg } from '@/features/emergency/infrastructure/qrLabelSvg'
import { analyzeQrLabel } from '@/features/emergency/domain/analyzeQrLabel'
import { svgImageSource } from '@/lib/qr/svg'
import { PRINT_DPI } from '@/lib/qr/printUnits'
import { withPngResolution } from '@/shared/pngResolution'
import { loadImage } from '@/shared/loadImage'

async function printableSvg(qr, sizeCm) {
  if (!analyzeQrLabel(qr.text, sizeCm, qr.totalModules).canDownload)
    throw new Error('QR label size is insufficient')
  return qrLabelSvg(qr, sizeCm)
}
export async function exportQrSvg(qr, sizeCm) {
  return new Blob([await printableSvg(qr, sizeCm)], {
    type: 'image/svg+xml;charset=utf-8',
  })
}
export async function exportQr(qr, sizeCm) {
  const image = await loadImage(svgImageSource(await printableSvg(qr, sizeCm)))
  const canvas = document.createElement('canvas')
  canvas.width = analyzeQrLabel(qr.text, sizeCm, qr.totalModules).size
  canvas.height = canvas.width
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas unavailable')
  context.imageSmoothingEnabled = false
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return withPngResolution(canvas.toDataURL('image/png'), PRINT_DPI)
}
