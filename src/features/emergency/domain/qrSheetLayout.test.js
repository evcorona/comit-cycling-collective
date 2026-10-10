import { describe, expect, it } from 'vitest'
import { qrSheetLayout } from '@/features/emergency/domain/qrSheetLayout'
import { QR_SHEET } from '@/features/emergency/domain/constants/qrSheet'
import { createEmergencyQr } from '@/features/emergency/application/createEmergencyQr'
import { createPrintableQr } from '@/features/emergency/infrastructure/createPrintableQr'
import { defaultValues } from '@/features/emergency/domain/constants/fields'
import { formatCardValue } from '@/features/emergency/domain/formatCardValue'
import { formSchema } from '@/features/emergency/domain/schema/emergencySchema'

const data = {
  ...defaultValues,
  name: 'ANA',
  contact: 'LUIS',
  phone: '5512345678',
  insurer: 'SEGURO TEST',
  insurancePlan: 'PLAN TEST',
  policy: 'ABC-123',
}
describe('insurance, card phones and letter-size template', () => {
  it('includes the insurer in QR while keeping plan and policy card-only', async () => {
    const result = await createEmergencyQr(data, createPrintableQr)
    expect(result.data.policy).toBe('ABC-123')
    for (const qr of [result.qr, ...Object.values(result.qrBySize)]) {
      expect(qr.text.replace(/\r\n /g, '')).toContain('SEGURO: SEGURO TEST')
      expect(qr.text).not.toContain('PLAN TEST')
      expect(qr.text).not.toContain('ABC-123')
      expect(qr.text).toContain('5512345678')
    }
  })
  it('formats both card phones without altering other fields', () => {
    expect(formatCardValue('phone', '5512345678')).toBe('55-1234-5678')
    expect(formatCardValue('phone2', '5598765432')).toBe('55-9876-5432')
    expect(formatCardValue('policy', 'ABC-123')).toBe('ABC-123')
  })
  it('validates optional insurance fields with their own limits and ASCII policy', () => {
    expect(formSchema.safeParse(data).success).toBe(true)
    expect(
      formSchema.safeParse({ ...data, policy: 'A'.repeat(25) }).success,
    ).toBe(false)
    expect(formSchema.safeParse({ ...data, insurer: 'Á' }).success).toBe(false)
  })
  it('fits 15 repeated labels of all four sizes on one letter page without overlap', async () => {
    const result = await createEmergencyQr(data, createPrintableQr)
    const items = qrSheetLayout(result.qrBySize)
    expect(items).toHaveLength(15)
    expect([...new Set(items.map(({ size }) => size))].sort()).toEqual([
      3, 4, 5, 6,
    ])
    for (const item of items) {
      expect(item.x).toBeGreaterThanOrEqual(QR_SHEET.marginCm)
      expect(item.y).toBeGreaterThanOrEqual(QR_SHEET.topCm)
      expect(item.x + item.width).toBeLessThanOrEqual(
        QR_SHEET.widthCm - QR_SHEET.marginCm,
      )
      expect(item.y + item.height).toBeLessThanOrEqual(
        QR_SHEET.heightCm - QR_SHEET.marginCm,
      )
    }
    items.forEach((a, i) =>
      items
        .slice(i + 1)
        .forEach((b) =>
          expect(
            a.x + a.width <= b.x ||
              b.x + b.width <= a.x ||
              a.y + a.height <= b.y ||
              b.y + b.height <= a.y,
          ).toBe(true),
        ),
    )
  })
})
