import QRCode from 'qrcode'
import {
  PRINT_DPI,
  CM_PER_INCH,
} from '@/features/emergency/domain/constants/export'
import {
  QR_MARGIN_MODULES,
  QR_MIN_MODULE_MM,
} from '@/features/emergency/domain/constants/qr'
export function getQrPrintSizing(text) {
  const modules =
    QRCode.create(text, { errorCorrectionLevel: 'M' }).modules.size +
    QR_MARGIN_MODULES * 2
  const modulePixels = Math.ceil(
    (QR_MIN_MODULE_MM * PRINT_DPI) / (CM_PER_INCH * 10),
  )
  const minimumCm =
    Math.ceil(((modules * modulePixels * CM_PER_INCH) / PRINT_DPI) * 10) / 10
  return { minimumCm, recommendedCm: Math.max(3, Math.ceil(minimumCm * 2) / 2) }
}
export function encodeQrImage(text, width = 1200, useIntegerScale = false) {
  const modules =
    QRCode.create(text, { errorCorrectionLevel: 'M' }).modules.size +
    QR_MARGIN_MODULES * 2
  if (width < modules) throw new Error('QR image is too small')
  if (useIntegerScale) width = Math.floor(width / modules) * modules

  return QRCode.toDataURL(text, {
    width,
    margin: QR_MARGIN_MODULES,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' },
  })
}
