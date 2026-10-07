import { QR_LABEL } from '@/features/emergency/domain/constants/qrLabel'
import { cmToPrintPixels, CM_PER_INCH, PRINT_DPI } from '@/lib/qr/printUnits'

export function qrLabelLayout(sizeCm, totalModules) {
  const size = cmToPrintPixels(sizeCm)
  const padding = cmToPrintPixels(QR_LABEL.paddingCm)
  const logoHeight = cmToPrintPixels(sizeCm * QR_LABEL.logoHeightRatio)
  const logoWidth = logoHeight * QR_LABEL.logoAspectRatio
  const qrY = padding + logoHeight + cmToPrintPixels(QR_LABEL.logoGapCm)
  const available = Math.min(
    size - padding * 2,
    size - qrY - cmToPrintPixels(QR_LABEL.bottomCm),
  )
  const qrPixels = Math.floor(available / totalModules) * totalModules
  return {
    size,
    logoHeight,
    logoWidth,
    logoX: (size - logoWidth) / 2,
    logoY: padding,
    qrPixels,
    qrX: Math.floor((size - qrPixels) / 2),
    qrY,
    qrCm: (qrPixels * CM_PER_INCH) / PRINT_DPI,
  }
}
