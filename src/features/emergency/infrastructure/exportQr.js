import { createQrSvg } from '@/lib/qr/createQrSvg'
import { resizeQrSvg, svgImageSource } from '@/lib/qr/svg'
import { getQrPrintAnalysis } from '@/lib/qr/getQrPrintAnalysis'
import {
  QR_DEFAULT_LEVEL,
  QR_LABEL_HEIGHT_CM,
  QR_LABEL_FONT_CM,
} from '@/lib/qr/constants'
import { PRINT_DPI, cmToPrintPixels } from '@/lib/qr/printUnits'
import { withPngResolution } from '@/shared/pngResolution'
import { loadImage } from '@/shared/loadImage'

function printableModel(qr, sizeCm, errorCorrection) {
  const model = createQrSvg(qr.text, { errorCorrection })
  if (!getQrPrintAnalysis(qr.text, sizeCm, model.totalModules).canPrint)
    throw new Error('QR print size is insufficient')
  return model
}
export function exportQrSvg(qr, sizeCm, errorCorrection = QR_DEFAULT_LEVEL) {
  const model = printableModel(qr, sizeCm, errorCorrection)
  const svg = resizeQrSvg(model.svg, `${sizeCm}cm`)
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
}
export async function exportQr(qr, sizeCm, errorCorrection = QR_DEFAULT_LEVEL) {
  const model = printableModel(qr, sizeCm, errorCorrection)
  const width = cmToPrintPixels(sizeCm)
  const integerWidth =
    Math.floor(width / model.totalModules) * model.totalModules
  const image = await loadImage(
    svgImageSource(resizeQrSvg(model.svg, integerWidth)),
  )
  const labelHeight = cmToPrintPixels(QR_LABEL_HEIGHT_CM)
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
    Math.floor((width - integerWidth) / 2),
    Math.floor((width - integerWidth) / 2),
  )
  context.fillStyle = '#000000'
  context.font = `bold ${cmToPrintPixels(QR_LABEL_FONT_CM)}px Arial`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(qr.title, width / 2, width + labelHeight / 2)
  return withPngResolution(canvas.toDataURL('image/png'), PRINT_DPI)
}
