import { describe, expect, it } from 'vitest'
import { QR_LIMITS } from '@/lib/qr/constants'
import { getUtf8ByteLength } from '@/lib/qr/getUtf8ByteLength'
import { isQrAlphanumeric, getQrEncodingMode } from '@/lib/qr/getQrEncodingMode'
import { getQrContentStatus } from '@/lib/qr/getQrContentStatus'
import { getRecommendedQrSize } from '@/lib/qr/getRecommendedQrSize'
import { getQrOptimizationSuggestions } from '@/lib/qr/getQrOptimizationSuggestions'
import { createQrSvg } from '@/lib/qr/createQrSvg'
import { getQrPrintAnalysis } from '@/lib/qr/getQrPrintAnalysis'
import { sanitizeEmergencyText } from '@/features/emergency/domain/sanitizeEmergencyText'
import { createTextMask } from '@/features/emergency/domain/constants/input'
import { defaultValues } from '@/features/emergency/domain/constants/fields'
import { formSchema } from '@/features/emergency/domain/schema/emergencySchema'
import { createEmergencyQr } from '@/features/emergency/application/createEmergencyQr'
import { createPrintableQr } from '@/features/emergency/infrastructure/createPrintableQr'
import {
  CARD_FRONT_ROWS,
  CARD_BACK_ROWS,
} from '@/features/emergency/domain/constants/card'

describe('UTF-8 content and encoding recommendations', () => {
  it.each([
    ['ABC123', 6, true, 1],
    ['VERONICA CORONA', 15, true, 1],
    ['VERÓNICA CORONA', 16, false, 2],
    ['Veronica Corona', 15, false, 2],
    ['123456789', 9, true, 1],
    ['ABC:123/XYZ', 11, true, 1],
    ['😀', 4, false, 1],
  ])(
    '%s counts UTF-8 bytes and suggests a size',
    (value, bytes, optimized, size) => {
      expect(getUtf8ByteLength(value)).toBe(bytes)
      expect(isQrAlphanumeric(value)).toBe(optimized)
      expect(getQrEncodingMode(value)).toBe(
        /^\d+$/.test(value) ? 'numeric' : optimized ? 'alphanumeric' : 'byte',
      )
      expect(getRecommendedQrSize(value)).toMatchObject({
        status: 'supported',
        physicalSizeCm: size,
        byteLength: bytes,
      })
      expect(getQrContentStatus(value, size)).toBe('optimal')
    },
  )
  it.each(Object.entries(QR_LIMITS))(
    'respects all boundary limits for %scm',
    (size, limit) => {
      expect(
        getQrContentStatus('a'.repeat(limit.recommendedBytes), Number(size)),
      ).toBe('optimal')
      expect(
        getQrContentStatus(
          'a'.repeat(limit.recommendedBytes + 1),
          Number(size),
        ),
      ).toBe('warning')
      expect(
        getQrContentStatus('a'.repeat(limit.maxBytesM), Number(size)),
      ).toBe('warning')
      expect(
        getQrContentStatus('a'.repeat(limit.maxBytesM + 1), Number(size)),
      ).toBe('over-limit')
    },
  )
  it('does not truncate content above the supported range', () => {
    expect(getRecommendedQrSize('a'.repeat(1351))).toMatchObject({
      status: 'unsupported',
      physicalSizeCm: null,
      byteLength: 1351,
    })
    expect(() => getQrContentStatus('ABC', 2.5)).toThrow(RangeError)
  })
  it('suggests changes without modifying text or claiming newlines are alphanumeric', () => {
    expect(isQrAlphanumeric('ABC\n123')).toBe(false)
    expect(getQrOptimizationSuggestions('Verónica 😀\nNotas,')).toEqual([
      'uppercase',
      'ascii',
      'lineBreaks',
      'punctuation',
    ])
    expect(getQrOptimizationSuggestions('ABC:123/XYZ')).toEqual([])
  })
})

describe('qrcode.react is the sole QR encoder', () => {
  it.each(['L', 'M', 'Q', 'H'])(
    'preserves a four-module quiet zone with level %s',
    (errorCorrection) => {
      const model = createQrSvg('ABC123', { errorCorrection })
      expect(model.totalModules).toBe(model.modules + 8)
      expect(model.version).toBeGreaterThanOrEqual(1)
      expect(model.svg).toContain(
        `viewBox="0 0 ${model.totalModules} ${model.totalModules}"`,
      )
      expect(model.svg).toContain('fill="#FFFFFF"')
      expect(model.svg).toContain('fill="#000000"')
      expect(model.svg).not.toContain('<image')
    },
  )
  it('accounts for real matrix density, not only byte count', () => {
    const model = createQrSvg('ABC123')
    expect(getQrContentStatus('ABC123', 1)).toBe('optimal')
    expect(getQrPrintAnalysis('ABC123', 1, model.totalModules).canPrint).toBe(
      false,
    )
    expect(getQrPrintAnalysis('ABC123', 2, model.totalModules).canPrint).toBe(
      true,
    )
  })
  it('blocks dense Byte content that exceeds the real version or physical size', () => {
    const value = 'a'.repeat(300)
    const model = createQrSvg(value)
    expect(getQrPrintAnalysis(value, 3, model.totalModules)).toMatchObject({
      status: 'over-limit',
      canPrint: false,
    })
  })
})

describe('emergency input and single QR integration', () => {
  const data = {
    ...defaultValues,
    name: 'ANA',
    contact: 'LUIS',
    phone: '5512345678',
    conditions: 'ALERGIA: PENICILINA',
    notes: 'AVISAR A MI FAMILIA',
  }
  it('normalizes accents, case and unsupported Unicode without joining bullet-separated words', () => {
    expect(sanitizeEmergencyText('María Muñoz → • ✓ — 😀')).toBe(
      'MARIA MUNOZ       - ',
    )
    expect(sanitizeEmergencyText('A•B')).toBe('A B')
  })
  it.each([...'→•✓—ñáéíóúÑÁÉÍÓÚ😀', 'a', '\u0301'])(
    'mask and schema reject %s',
    (character) => {
      expect(createTextMask(100).test('ANA' + character)).toBe(false)
      expect(
        formSchema.safeParse({ ...data, name: 'ANA' + character }).success,
      ).toBe(false)
    },
  )
  it('limits medical details and notes independently', () => {
    expect(formSchema.safeParse(data).success).toBe(true)
    expect(
      formSchema.safeParse({ ...data, notes: 'A'.repeat(81) }).success,
    ).toBe(false)
    expect(
      formSchema.safeParse({ ...data, conditions: 'A'.repeat(101) }).success,
    ).toBe(false)
  })
  it('includes contacts, medical text and notes in one embedded uppercase payload', async () => {
    const result = await createEmergencyQr(data, createPrintableQr)
    expect(result.qrs).toBeUndefined()
    expect(result.qr.text).toContain('CONTACTO-1: LUIS 5512345678')
    expect(result.qr.text).toContain('INFO-MEDICA: ALERGIA: PENICILINA')
    expect(result.qr.text).toContain('NOTAS: AVISAR A MI FAMILIA')
    expect(result.qr.text).toBe(result.qr.text.toUpperCase())
    expect(result.qr.text.endsWith('EMERGENCIA')).toBe(true)
    expect(
      CARD_FRONT_ROWS.flatMap((row) => row.flatMap(({ fields }) => fields)),
    ).not.toContain('notes')
    expect(
      CARD_BACK_ROWS.flatMap((row) => row.flatMap(({ fields }) => fields)),
    ).toContain('notes')
  })
})
