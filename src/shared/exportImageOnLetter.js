import { LETTER_PAGE } from '@/shared/constants/print'
import { loadImage } from '@/shared/loadImage'
import { withPngResolution } from '@/shared/pngResolution'
import { PRINT_DPI, cmToPrintPixels } from '@/lib/qr/printUnits'

export async function exportImageOnLetter(blob, widthCm, heightCm) {
  const url = URL.createObjectURL(blob)
  try {
    const image = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = cmToPrintPixels(LETTER_PAGE.widthCm)
    canvas.height = cmToPrintPixels(LETTER_PAGE.heightCm)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas unavailable')
    const width = cmToPrintPixels(widthCm)
    const height = cmToPrintPixels(heightCm)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.imageSmoothingEnabled = false
    context.drawImage(
      image,
      cmToPrintPixels(LETTER_PAGE.marginCm),
      cmToPrintPixels(LETTER_PAGE.marginCm),
      width,
      height,
    )
    return withPngResolution(canvas.toDataURL('image/png'), PRINT_DPI)
  } finally {
    URL.revokeObjectURL(url)
  }
}
