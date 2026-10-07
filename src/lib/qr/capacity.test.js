import { describe, expect, it } from 'vitest'
import { QR_LIMITS } from '@/lib/qr/constants'
import { getQrContentMetrics } from '@/lib/qr/getQrContentMetrics'
import { getQrContentStatus } from '@/lib/qr/getQrContentStatus'
import { getRecommendedQrSize } from '@/lib/qr/getRecommendedQrSize'
import { createQrSvg } from '@/lib/qr/createQrSvg'
import { getQrPrintAnalysis } from '@/lib/qr/getQrPrintAnalysis'

describe('mode-specific capacity instead of treating UTF-8 weight as capacity', () => {
  it('allows 300 uppercase characters at 3cm, while 300 lowercase bytes need a larger matrix', () => {
    const upper = 'A'.repeat(300)
    const lower = 'a'.repeat(300)
    expect(getQrContentMetrics(upper, 3)).toMatchObject({
      mode: 'alphanumeric',
      byteLength: 300,
      unit: 'characters',
      maximumLimit: 419,
    })
    expect(getQrContentStatus(upper, 3)).toBe('optimal')
    expect(getRecommendedQrSize(upper).physicalSizeCm).toBe(3)
    expect(
      getQrPrintAnalysis(upper, 3, createQrSvg(upper).totalModules).canPrint,
    ).toBe(true)
    expect(getQrContentStatus(lower, 3)).toBe('over-limit')
    expect(
      getQrPrintAnalysis(lower, 3, createQrSvg(lower).totalModules).canPrint,
    ).toBe(false)
  })
  it('counts numeric capacity separately and preserves Unicode byte counts', () => {
    const numeric = '1'.repeat(600)
    expect(getQrContentMetrics(numeric, 3)).toMatchObject({
      mode: 'numeric',
      maximumLimit: 691,
      unit: 'characters',
    })
    expect(
      getQrPrintAnalysis(numeric, 3, createQrSvg(numeric).totalModules)
        .canPrint,
    ).toBe(true)
    expect(getQrContentMetrics('😀'.repeat(10), 2)).toMatchObject({
      mode: 'byte',
      byteLength: 40,
      characterCount: 10,
      contentLength: 40,
      unit: 'bytes',
    })
  })
  it.each(Object.entries(QR_LIMITS))(
    'matches the real encoder capacities at version for %scm',
    (size, limit) => {
      for (const [character, maximum] of [
        ['A', limit.maxAlphanumericM],
        ['1', limit.maxNumericM],
      ]) {
        expect(createQrSvg(character.repeat(maximum)).version).toBe(
          limit.version,
        )
        expect(
          createQrSvg(character.repeat(maximum + 1)).version,
        ).toBeGreaterThan(limit.version)
        const { recommendedLimit } = getQrContentMetrics(
          character,
          Number(size),
        )
        expect(
          getQrContentStatus(character.repeat(recommendedLimit), Number(size)),
        ).toBe('optimal')
        expect(
          getQrContentStatus(
            character.repeat(recommendedLimit + 1),
            Number(size),
          ),
        ).toBe('warning')
        expect(
          getQrContentStatus(character.repeat(maximum + 1), Number(size)),
        ).toBe('over-limit')
      }
    },
  )
  it('uses the actual encoded matrix as the print gate, even when another level exceeds the M guide', () => {
    const value = 'A'.repeat(2200)
    const model = createQrSvg(value, { errorCorrection: 'L' })
    expect(getQrContentStatus(value, 6)).toBe('over-limit')
    expect(getQrPrintAnalysis(value, 6, model.totalModules).canPrint).toBe(true)
  })
})
