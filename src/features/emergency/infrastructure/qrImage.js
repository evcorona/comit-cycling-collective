import QRCode from 'qrcode'
export function encodeQrImage(text) {
  return QRCode.toDataURL(text, {
    width: 1200,
    margin: 4,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' },
  })
}
