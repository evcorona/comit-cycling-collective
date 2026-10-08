import { QR_SHEET } from '@/features/emergency/domain/constants/qrSheet'
import { qrLabelLayout } from '@/features/emergency/domain/qrLabelLayout'

export function qrSheetLayout(qrBySize) {
  const items = []
  let y = QR_SHEET.topCm
  for (const row of QR_SHEET.rows) {
    const widths = row.map(
      (size) => qrLabelLayout(size, qrBySize[size].totalModules).sizeCm,
    )
    const width =
      widths.reduce((sum, item) => sum + item, 0) +
      QR_SHEET.gapCm * (row.length - 1)
    if (width > QR_SHEET.widthCm - 2 * QR_SHEET.marginCm)
      throw new Error('Sheet width exceeded')
    let x = (QR_SHEET.widthCm - width) / 2
    row.forEach((size, index) => {
      items.push({ size, x, y, width: widths[index], height: widths[index] })
      x += widths[index] + QR_SHEET.gapCm
    })
    y += Math.max(...widths) + QR_SHEET.gapCm
  }
  if (y > QR_SHEET.heightCm - QR_SHEET.marginCm)
    throw new Error('Sheet height exceeded')
  return items
}
