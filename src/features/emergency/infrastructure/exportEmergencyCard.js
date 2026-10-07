import texts from '@/locales/es.json'
import {
  CARD_WIDTH_CM,
  CARD_HEIGHT_CM,
  CARD_FRONT_ROWS,
  CARD_BACK_ROWS,
  CARD_STYLE,
} from '@/features/emergency/domain/constants/card'
import {
  PRINT_DPI,
  printPixels,
} from '@/features/emergency/domain/constants/export'
import { withPngResolution } from '@/shared/pngResolution'
import { loadImage } from '@/shared/loadImage'
import {
  createCardLayout,
  drawCardLayout,
} from '@/features/emergency/infrastructure/cardLayout'

function drawFace(
  context,
  { width, height, logo, title, layout, noMedicalData },
) {
  const { padding, bodyTop } = CARD_STYLE
  context.textBaseline = 'top'
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.fillStyle = '#000000'
  context.fillRect(0, 0, width, 110)
  context.drawImage(logo, padding, 10, 90, 90)
  context.fillStyle = '#ffffff'
  context.font = 'bold 32px Arial'
  context.fillText(title, 155, 26)
  context.font = 'italic 21px Arial'
  context.fillText(texts.header.motto, 155, 70)
  const end = drawCardLayout(context, layout, padding, bodyTop)
  if (noMedicalData) {
    context.fillStyle = '#000000'
    context.font = '24px Arial'
    context.fillText(texts.card.noMedicalData, padding, end)
  }
  context.fillStyle = '#E5295D'
  context.fillRect(padding, height - 48, width - padding * 2, 2)
  context.fillStyle = '#000000'
  context.font = '16px Arial'
  context.fillText(texts.card.footer, padding, height - 32)
}

export async function exportEmergencyCard(result) {
  const canvas = document.createElement('canvas')
  const faceWidth = printPixels(CARD_WIDTH_CM)
  const faceHeight = printPixels(CARD_HEIGHT_CM)
  canvas.width = faceWidth
  // Exact equal halves avoid a rounding mismatch at the fold.
  canvas.height = faceHeight * 2
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas unavailable')
  const logo = await loadImage('/logo_rosa.png')
  const bodyWidth = faceWidth - CARD_STYLE.padding * 2
  const bodyHeight = faceHeight - CARD_STYLE.bottomSpace - CARD_STYLE.bodyTop
  const front = createCardLayout(
    context,
    result.data,
    CARD_FRONT_ROWS,
    bodyWidth,
    bodyHeight,
  )
  const back = createCardLayout(
    context,
    result.data,
    CARD_BACK_ROWS,
    bodyWidth,
    bodyHeight,
  )
  const common = { width: faceWidth, height: faceHeight, logo }
  drawFace(context, { ...common, title: texts.card.title, layout: front })
  context.save()
  // Rotate the lower face so both sides are upright after folding back-to-back.
  context.translate(faceWidth, canvas.height)
  context.rotate(Math.PI)
  drawFace(context, {
    ...common,
    title: texts.card.medicalTitle,
    layout: back,
    noMedicalData: !['allergies', 'conditions', 'medications', 'notes'].some(
      (name) => result.data[name]?.trim(),
    ),
  })
  context.restore()
  context.strokeStyle = '#E5295D'
  context.lineWidth = 2
  context.setLineDash([12, 10])
  context.beginPath()
  context.moveTo(0, faceHeight)
  context.lineTo(faceWidth, faceHeight)
  context.stroke()
  return withPngResolution(canvas.toDataURL('image/png'), PRINT_DPI)
}
