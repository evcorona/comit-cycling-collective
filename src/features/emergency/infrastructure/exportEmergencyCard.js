import texts from '@/locales/es.json'
import { emergencyFields } from '@/features/emergency/domain/constants/fields'
import {
  CARD_WIDTH_CM,
  CARD_HEIGHT_CM,
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
    encodeQrImage(result.text, 360).then(loadImage),
  ])
  const padding = 60
  const bodyWidth = canvas.width - padding * 2
  const qrTop = canvas.height - 440
  const rows = emergencyFields.filter(({ name }) => result.data[name].trim())
  let fontSize = 40
  let layout
  do {
    context.font = `${fontSize}px Arial`
    layout = rows.map(({ name, label }) => ({
      label,
      lines: wrapCanvasText(context, result.data[name], bodyWidth),
    }))
    const height = layout.reduce(
      (sum, row) => sum + 34 + row.lines.length * (fontSize + 8) + 16,
      0,
    )
    if (height <= qrTop - 215) break
    fontSize--
  } while (fontSize >= 18)
  if (fontSize < 18) throw new Error('Card capacity exceeded')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#000000'
  context.fillRect(0, 0, canvas.width, 160)
  context.drawImage(logo, padding, 15, 130, 130)
  context.fillStyle = '#ffffff'
  context.font = 'bold 42px Arial'
  context.fillText(texts.card.title, 220, 75)
  context.font = 'italic 24px Arial'
  context.fillText(texts.header.motto, 220, 115)
  let y = 205
  for (const row of layout) {
    context.fillStyle = '#E5295D'
    context.font = 'bold 28px Arial'
    context.fillText(row.label, padding, y)
    y += 34
    context.fillStyle = '#000000'
    context.font = `${fontSize}px Arial`
    for (const line of row.lines) {
      context.fillText(line, padding, y)
      y += fontSize + 8
    }
    y += 16
  }
  context.fillStyle = '#E5295D'
  context.fillRect(padding, qrTop - 10, bodyWidth, 3)
  context.drawImage(qr, padding, qrTop + 15, 360, 360)
  context.fillStyle = '#000000'
  context.font = 'bold 28px Arial'
  context.fillText(texts.qrResult.offlineTitle, 465, qrTop + 110)
  context.font = '24px Arial'
  const lines = wrapCanvasText(
    context,
    texts.card.scanHint,
    canvas.width - 465 - padding,
  )
  lines.forEach((line, index) =>
    context.fillText(line, 465, qrTop + 160 + index * 32),
  )
  context.font = '20px Arial'
  context.fillText(texts.card.footer, padding, canvas.height - 30)
  return withPngResolution(canvas.toDataURL('image/png'), PRINT_DPI)
}
