import { QR_LABEL } from '@/features/emergency/domain/constants/qrLabel'
import { cmToPrintPixels, CM_PER_INCH, PRINT_DPI } from '@/lib/qr/printUnits'

export function qrLabelLayout(sizeCm, totalModules) {
  const qrSlotPixels = cmToPrintPixels(sizeCm)
  const padding = cmToPrintPixels(QR_LABEL.paddingCm)
  const logoHeight = cmToPrintPixels(sizeCm * QR_LABEL.logoHeightRatio)
  const logoWidth = logoHeight * QR_LABEL.logoAspectRatio
  const band = padding + logoHeight + cmToPrintPixels(QR_LABEL.logoGapCm)
  // Reserve equal bands on all sides so branding cannot shift the QR.
  const size = qrSlotPixels + band * 2
  const qrPixels = Math.floor(qrSlotPixels / totalModules) * totalModules
  const qrOffset = Math.floor((size - qrPixels) / 2)
  return {
    size,
    sizeCm: (size * CM_PER_INCH) / PRINT_DPI,
    qrSlotPixels,
    logoHeight,
    logoWidth,
    logoX: (size - logoWidth) / 2,
    logoY: padding,
    qrPixels,
    qrX: qrOffset,
    qrY: qrOffset,
  }
}
