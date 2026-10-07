import texts from '@/locales/es.json'
import { CARD_STYLE } from '@/features/emergency/domain/constants/card'
import { wrapCanvasText } from '@/shared/wrapCanvasText'

export function createCardLayout(context, data, rows, width, availableHeight) {
  const populated = rows
    .map((row) =>
      row
        .map(({ label, fields }) => ({
          label: texts.fields[label].label,
          values: fields.map((name) => data[name]?.trim()).filter(Boolean),
        }))
        .filter(({ values }) => values.length),
    )
    .filter((row) => row.length)
  for (
    let fontSize = CARD_STYLE.maxFontSize;
    fontSize >= CARD_STYLE.minFontSize;
    fontSize--
  ) {
    const lineHeight = Math.ceil(fontSize * CARD_STYLE.lineHeightFactor)
    context.font = `${fontSize}px Arial`
    const layout = populated.map((row) => {
      const cellWidth =
        (width - CARD_STYLE.columnGap * (row.length - 1)) / row.length
      const cells = row.map(({ label, values }) => ({
        label,
        width: cellWidth,
        lines: values.flatMap((value) =>
          wrapCanvasText(context, value, cellWidth),
        ),
      }))
      return {
        cells,
        height:
          CARD_STYLE.labelHeight +
          CARD_STYLE.labelGap +
          Math.max(...cells.map(({ lines }) => lines.length)) * lineHeight,
      }
    })
    const height =
      layout.reduce((sum, row) => sum + row.height, 0) +
      Math.max(0, layout.length - 1) * CARD_STYLE.rowGap
    if (height <= availableHeight) return { rows: layout, fontSize, lineHeight }
  }
  throw new Error('Card capacity exceeded')
}

export function drawCardLayout(context, layout, x, y) {
  for (const row of layout.rows) {
    let left = x
    for (const cell of row.cells) {
      context.fillStyle = '#E5295D'
      context.font = 'bold 18px Arial'
      context.fillText(cell.label, left, y)
      context.fillStyle = '#000000'
      context.font = `${layout.fontSize}px Arial`
      cell.lines.forEach((line, index) =>
        context.fillText(
          line,
          left,
          y +
            CARD_STYLE.labelHeight +
            CARD_STYLE.labelGap +
            index * layout.lineHeight,
        ),
      )
      left += cell.width + CARD_STYLE.columnGap
    }
    y += row.height + CARD_STYLE.rowGap
  }
  return y
}
