import { describe, expect, it } from 'vitest'
import { selectEmergencyQr } from '@/features/emergency/application/selectEmergencyQr'
import { createPrintableQr } from '@/features/emergency/infrastructure/createPrintableQr'
import { getQrPrintAnalysis } from '@/lib/qr/getQrPrintAnalysis'
import { defaultValues } from '@/features/emergency/domain/constants/fields'

const data = {
  ...defaultValues,
  name: 'ANA',
  birthDate: '1990-05-12',
  bloodType: 'O+',
  contact: 'LUIS',
  phone: '5512345678',
  conditions: 'ALERGIA A PENICILINA',
  notes: 'AVISAR A FAMILIA',
}

describe('size-aware emergency QR priorities', () => {
  it('includes all fields at 3 cm when the full content is recommended', async () => {
    const qr = await selectEmergencyQr(data, 3, createPrintableQr)
    expect(qr.text).toContain('CONTACTO-1: LUIS 5512345678')
    expect(qr.text).toContain('NACIMIENTO: 1990-05-12')
    expect(qr.text).toContain('INFO-MEDICA')
    expect(qr.text).toContain('NOTAS')
    expect(qr.text).not.toContain('SIN DATOS')
    expect(qr.omitted).toEqual([])
    expect(qr.canDownload).toBe(true)
    expect(getQrPrintAnalysis(qr.text, 3, qr.totalModules).canPrint).toBe(true)
    expect(data.conditions).toBe('ALERGIA A PENICILINA')
  })
  it.each([3, 4, 5, 6])(
    'falls back to basic fields at %scm if medical text cannot fit',
    async (size) => {
      const qr = await selectEmergencyQr(
        { ...data, conditions: 'A'.repeat(2200) },
        size,
        createPrintableQr,
      )
      expect(qr.included).toEqual([])
      expect(qr.omitted).toEqual(['conditions', 'notes'])
      expect(qr.canDownload).toBe(true)
    },
  )
  it('adds medical information before notes when both fit', async () => {
    const qr = await selectEmergencyQr(data, 6, createPrintableQr)
    expect(qr.included).toEqual(['conditions', 'notes'])
    expect(qr.omitted).toEqual([])
    expect(qr.text.indexOf('INFO-MEDICA')).toBeLessThan(
      qr.text.indexOf('NOTAS'),
    )
  })
  it('keeps a fitting medical field and omits oversized notes without truncating', async () => {
    const qr = await selectEmergencyQr(
      { ...data, notes: 'A'.repeat(2000) },
      4,
      createPrintableQr,
    )
    expect(qr.included).toEqual(['conditions'])
    expect(qr.omitted).toEqual(['notes'])
    expect(qr.text).toContain('INFO-MEDICA: ALERGIA A PENICILINA')
    expect(qr.text).not.toContain('NOTAS')
  })
  it('does not skip medical priority to include lower-priority notes', async () => {
    const qr = await selectEmergencyQr(
      { ...data, conditions: 'A'.repeat(2000) },
      4,
      createPrintableQr,
    )
    expect(qr.included).toEqual([])
    expect(qr.omitted).toEqual(['conditions', 'notes'])
  })
  it('allows notes if no medical information was provided', async () => {
    const qr = await selectEmergencyQr(
      { ...data, conditions: '' },
      4,
      createPrintableQr,
    )
    expect(qr.included).toEqual(['notes'])
    expect(qr.omitted).toEqual([])
  })
  it('never removes basic fields even if a larger size is needed', async () => {
    const qr = await selectEmergencyQr(
      {
        ...data,
        name: 'A'.repeat(100),
        contact: 'B'.repeat(100),
        contact2: 'C'.repeat(100),
        phone2: '5598765432',
      },
      3,
      createPrintableQr,
    )
    expect(qr.text).toContain('NOMBRE: ' + 'A'.repeat(100))
    expect(qr.text).toContain('CONTACTO-2: ' + 'C'.repeat(100))
    expect(getQrPrintAnalysis(qr.text, 3, qr.totalModules).canPrint).toBe(false)
    expect(qr.canDownload).toBe(false)
  })
})
