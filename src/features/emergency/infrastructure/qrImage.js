import QRCode from 'qrcode'
export function encodeQrImage(text, width = 1200) {
  return QRCode.toDataURL(text, {
    width,
    margin: 4,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' },
  })
}
