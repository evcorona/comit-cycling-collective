import { exportQrLabelImage } from '@/features/emergency/infrastructure/exportQr'
import { qrSheetLayout } from '@/features/emergency/domain/qrSheetLayout'
import texts from '@/locales/es.json'

export async function exportQrSheet(qrBySize) {
  if (Object.values(qrBySize).some((qr) => !qr.canDownload))
    throw new Error('All QR sizes must be printable')
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'cm',
    format: 'letter',
    compress: true,
  })
  pdf.setFontSize(12)
  pdf.text(texts.sheet.title, 1, 0.9)
  pdf.setFontSize(9)
  pdf.text(texts.sheet.printHint, 1, 1.5)
  const images = {}
  for (const size of [3, 4, 5, 6])
    images[size] = new Uint8Array(
      await (await exportQrLabelImage(qrBySize[size], size)).arrayBuffer(),
    )
  for (const item of qrSheetLayout(qrBySize))
    pdf.addImage(
      images[item.size],
      'PNG',
      item.x,
      item.y,
      item.width,
      item.height,
      `qr-${item.size}`,
      'FAST',
    )
  return pdf.output('blob')
}
