import { describe, expect, it } from 'vitest'
import { createCardLayout } from '@/features/emergency/infrastructure/cardLayout'
import { CARD_STYLE } from '@/features/emergency/domain/constants/card'

const context = {
  font: '',
  measureText(text) {
    return { width: text.length * Number(this.font.match(/\d+/)[0]) * 0.6 }
  },
}

describe('printable card layout', () => {
  it('accounts for wrapped labels and values without losing content', () => {
    const name = 'ANA MARIA LOPEZ'
    const layout = createCardLayout(
      context,
      { name },
      [[{ label: 'name', fields: ['name'] }]],
      200,
      400,
    )
    const cell = layout.rows[0].cells[0]
    expect(cell.labelLines.length).toBeGreaterThan(1)
    expect(cell.lines.join(' ')).toBe(name)
    expect(layout.rows[0].height).toBe(
      cell.labelLines.length * CARD_STYLE.labelHeight +
        CARD_STYLE.labelGap +
        cell.lines.length * layout.lineHeight,
    )
    expect(layout.fontSize).toBeGreaterThanOrEqual(38)
  })

  it('rejects excess text instead of shrinking below readable print size', () => {
    expect(() =>
      createCardLayout(
        context,
        { name: 'W'.repeat(100) },
        [[{ label: 'name', fields: ['name'] }]],
        200,
        100,
      ),
    ).toThrow(RangeError)
  })
})
