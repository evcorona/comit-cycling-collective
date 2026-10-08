import { describe, expect, it } from 'vitest'
import { imagePrintPositions } from '@/shared/imagePrintPositions'
import { LETTER_PAGE } from '@/shared/constants/print'
import {
  CARD_WIDTH_CM,
  CARD_HEIGHT_CM,
} from '@/features/emergency/domain/constants/card'

describe('letter card template', () => {
  it('preserves single-image top-left placement', () => {
    expect(imagePrintPositions(CARD_WIDTH_CM, CARD_HEIGHT_CM * 2)).toEqual([
      { x: 1, y: 1 },
    ])
  })
  it('fits four full-size foldable cards without overlaps in one letter page', () => {
    const width = CARD_WIDTH_CM
    const height = CARD_HEIGHT_CM * 2
    const items = imagePrintPositions(width, height, true)
    expect(items).toHaveLength(4)
    for (const item of items) {
      expect(item.x + width).toBeLessThanOrEqual(
        LETTER_PAGE.widthCm - LETTER_PAGE.marginCm,
      )
      expect(item.y + height).toBeLessThanOrEqual(
        LETTER_PAGE.heightCm - LETTER_PAGE.marginCm,
      )
    }
    items.forEach((a, i) =>
      items
        .slice(i + 1)
        .forEach((b) =>
          expect(
            a.x + width <= b.x ||
              b.x + width <= a.x ||
              a.y + height <= b.y ||
              b.y + height <= a.y,
          ).toBe(true),
        ),
    )
  })
})
