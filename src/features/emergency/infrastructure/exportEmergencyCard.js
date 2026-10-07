import texts from '@/locales/es.json'
import {
  CARD_WIDTH_CM,
  CARD_HEIGHT_CM,
  CARD_PRINTED_SECTIONS,
} from '@/features/emergency/domain/constants/card'
import {
  PRINT_DPI,
  printPixels,
} from '@/features/emergency/domain/constants/export'
import { encodeQrImage } from '@/features/emergency/infrastructure/qrImage'
import { withPngResolution } from '@/shared/pngResolution'
import { wrapCanvasText } from '@/shared/wrapCanvasText'

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = source
  })
}

export async function exportEmergencyCard(result) {
  const canvas = document.createElement('canvas')
  canvas.width = printPixels(CARD_WIDTH_CM)
  canvas.height = printPixels(CARD_HEIGHT_CM)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas unavailable')
  const [logo, qr] = await Promise.all([
    loadImage('/logo_rosa.png'),
    encodeQrImage(result.text, 350, true).then(loadImage),
  ])
  const padding = 40
  const qrSize = 350
  const qrLeft = canvas.width - qrSize - padding
  const bodyWidth = qrLeft - padding * 2
  const bodyTop = 140
  const bodyBottom = canvas.height - 64
  const labelHeight = 24
  const labelGap = 8
  const sectionGap = 16
  const rows = CARD_PRINTED_SECTIONS.map(({ label, fields }) => ({
    label: texts.fields[label].label,
    values: fields.map((name) => result.data[name]?.trim()).filter(Boolean),
  })).filter(({ values }) => values.length)
  let fontSize = 32
  let lineHeight
  let layout
  do {
    lineHeight = Math.ceil(fontSize * 1.25)
    context.font = `${fontSize}px Arial`
    layout = rows.map(({ values, label }) => ({
      label,
      lines: values.flatMap((value) =>
        wrapCanvasText(context, value, bodyWidth),
      ),
    }))
    const height =
      layout.reduce(
        (sum, row) =>
          sum +
          labelHeight +
          labelGap +
          row.lines.length * lineHeight +
          sectionGap,
        0,
      ) - sectionGap
    if (height <= bodyBottom - bodyTop) break
    fontSize--
  } while (fontSize >= 16)
  if (fontSize < 16) throw new Error('Card capacity exceeded')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#000000'
  context.fillRect(0, 0, canvas.width, 110)
  context.drawImage(logo, padding, 10, 90, 90)
  context.fillStyle = '#ffffff'
  context.font = 'bold 32px Arial'
  context.fillText(texts.card.title, 155, 50)
  context.font = 'italic 21px Arial'
  context.fillText(texts.header.motto, 155, 82)
  context.textBaseline = 'top'
  let y = bodyTop
  for (const row of layout) {
    context.fillStyle = '#E5295D'
    context.font = 'bold 20px Arial'
    context.fillText(row.label, padding, y)
    y += labelHeight + labelGap
    context.fillStyle = '#000000'
    context.font = `${fontSize}px Arial`
    for (const line of row.lines) {
      context.fillText(line, padding, y)
      y += lineHeight
    }
    y += sectionGap
  }
  context.textBaseline = 'alphabetic'
  context.imageSmoothingEnabled = false
  context.drawImage(
    qr,
    qrLeft + (qrSize - qr.width) / 2,
    135 + (qrSize - qr.height) / 2,
  )
  context.fillStyle = '#000000'
  context.font = 'bold 21px Arial'
  context.fillText(texts.qrResult.offlineTitle, qrLeft + 20, 505)
  context.font = '18px Arial'
  const lines = wrapCanvasText(context, texts.card.scanHint, qrSize - 20)
  lines.forEach((line, index) =>
    context.fillText(line, qrLeft + 20, 535 + index * 22),
  )
  context.fillStyle = '#E5295D'
  context.fillRect(padding, canvas.height - 48, canvas.width - padding * 2, 2)
  context.fillStyle = '#000000'
  context.font = '16px Arial'
  context.fillText(texts.card.footer, padding, canvas.height - 20)
  return withPngResolution(canvas.toDataURL('image/png'), PRINT_DPI)
}
