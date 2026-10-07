import { describe, expect, it } from 'vitest'
import { qrLabelLayout } from '@/features/emergency/domain/qrLabelLayout'
import { analyzeQrLabel } from '@/features/emergency/domain/analyzeQrLabel'
import { createPrintableQr } from '@/features/emergency/infrastructure/createPrintableQr'
import { getQrPrintAnalysis } from '@/lib/qr/getQrPrintAnalysis'
import { getMinimumQrModulePixels } from '@/lib/qr/getQrPrintAnalysis'
import { cmToPrintPixels } from '@/lib/qr/printUnits'
import { selectEmergencyQr } from '@/features/emergency/application/selectEmergencyQr'
import { defaultValues } from '@/features/emergency/domain/constants/fields'

// The quiet zone is included in totalModules; artwork stays outside it.
describe('complete emergency label sizing', () => {
  it.each([3, 4, 5, 6])(
    'preserves integer modules and all artwork inside %scm',
    (size) => {
      const model = createPrintableQr('ABC123')
      const layout = qrLabelLayout(size, model.totalModules)
      expect(layout.qrSlotPixels).toBe(cmToPrintPixels(size))
      expect(layout.size).toBeGreaterThan(layout.qrSlotPixels)
      expect(layout.qrX).toBe(layout.qrY)
      expect(
        Math.abs(layout.size - layout.qrPixels - 2 * layout.qrX),
      ).toBeLessThanOrEqual(1)
      expect(layout.qrPixels % model.totalModules).toBe(0)
      expect(layout.qrPixels / model.totalModules).toBeGreaterThanOrEqual(
        getMinimumQrModulePixels(),
      )
      expect(layout.logoY + layout.logoHeight).toBeLessThan(layout.qrY)
      expect(layout.qrX).toBeGreaterThan(0)
      expect(layout.qrX + layout.qrPixels).toBeLessThan(layout.size)
      expect(layout.qrY + layout.qrPixels).toBeLessThan(layout.size)
    },
  )
  it('restores the original QR capacity without subtracting branding space', () => {
    const value = 'A'.repeat(360)
    const model = createPrintableQr(value)
    expect(getQrPrintAnalysis(value, 3, model.totalModules).canPrint).toBe(true)
    expect(analyzeQrLabel(value, 3, model.totalModules).canDownload).toBe(true)
    expect(analyzeQrLabel(value, 4, model.totalModules).canDownload).toBe(true)
  })
  it('admits 300 alphanumeric characters at 3cm with compact branding', () => {
    const value = 'A'.repeat(300)
    const model = createPrintableQr(value)
    expect(analyzeQrLabel(value, 3, model.totalModules).canDownload).toBe(true)
  })
  it('includes all short optional data when the complete 3cm label permits it', async () => {
    const qr = await selectEmergencyQr(
      {
        ...defaultValues,
        name: 'ANA',
        contact: 'LUIS',
        phone: '5512345678',
        conditions: 'ASMA',
        notes: 'AVISAR',
      },
      3,
      createPrintableQr,
    )
    expect(qr.canDownload).toBe(true)
    expect(qr.included).toEqual(['conditions', 'notes'])
  })
})
