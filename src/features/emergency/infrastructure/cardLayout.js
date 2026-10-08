import { getAffiliationLabels } from '@/features/emergency/domain/constants/healthProviders'
import { formatCardValue } from '@/features/emergency/domain/formatCardValue'
import texts from '@/locales/es.json'
import { CARD_STYLE } from '@/features/emergency/domain/constants/card'
import { wrapCanvasText } from '@/shared/wrapCanvasText'

export function createCardLayout(context, data, rows, width, availableHeight) {
  const populated = rows
    .map((row) =>
      row
        .map(({ label, fields }) => ({
          label:
            label === 'affiliation'
              ? getAffiliationLabels(data.insurer).label
              : (texts.card.labels[label] ?? texts.fields[label].label),
          values: fields
            .map((name) => formatCardValue(name, data[name]))
            .filter(Boolean),
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
      const cells = row.map(({ label, values }) => {
        context.font = `bold ${CARD_STYLE.labelHeight}px Arial`
        const labelLines = wrapCanvasText(context, label, cellWidth)
        context.font = `${fontSize}px Arial`
        return {
          labelLines,
          width: cellWidth,
          lines: values.flatMap((value) =>
            wrapCanvasText(context, value, cellWidth),
          ),
        }
      })
      return {
        cells,
        height: Math.max(
          ...cells.map(
            ({ labelLines, lines }) =>
              labelLines.length * CARD_STYLE.labelHeight +
              CARD_STYLE.labelGap +
              lines.length * lineHeight,
          ),
        ),
      }
    })
    const height =
      layout.reduce((sum, row) => sum + row.height, 0) +
      Math.max(0, layout.length - 1) * CARD_STYLE.rowGap
    if (height <= availableHeight) return { rows: layout, fontSize, lineHeight }
  }
  throw new RangeError('Card capacity exceeded')
}

export function drawCardLayout(context, layout, x, y) {
  for (const row of layout.rows) {
    let left = x
    for (const cell of row.cells) {
      context.fillStyle = '#000000'
      context.font = `bold ${CARD_STYLE.labelHeight}px Arial`
      cell.labelLines.forEach((line, index) =>
        context.fillText(line, left, y + index * CARD_STYLE.labelHeight),
      )
      context.fillStyle = '#000000'
      context.font = `${layout.fontSize}px Arial`
      cell.lines.forEach((line, index) =>
        context.fillText(
          line,
          left,
          y +
            cell.labelLines.length * CARD_STYLE.labelHeight +
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
