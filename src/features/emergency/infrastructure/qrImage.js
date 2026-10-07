import QRCode from 'qrcode'
export function encodeQrImage(text, width = 1200, useIntegerScale = false) {
  if (useIntegerScale) {
    const modules =
      QRCode.create(text, { errorCorrectionLevel: 'M' }).modules.size + 8
    width = Math.floor(width / modules) * modules
  }
  return QRCode.toDataURL(text, {
    width,
    margin: 4,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' },
  })
}
