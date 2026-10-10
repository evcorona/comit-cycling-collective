import { describe, expect, it } from 'vitest'
import { defaultValues } from '@/features/emergency/domain/constants/fields'
import { formatQrData } from '@/features/emergency/domain/formatQrData'

describe('compact emergency QR labels', () => {
  const data = {
    ...defaultValues,
    name: 'ANA',
    birthDate: '1990-05-12',
    bloodType: 'O+',
    contact: 'LUIS',
    phone: '55-1234-5678',
    contact2: 'SOFIA',
    phone2: '55-9876-5432',
    conditions: 'ALERGIA: PENICILINA',
    insurer: 'IMSS',
    policy: 'SOLO-TARJETA',
    affiliation: 'AFILIACION-PRIVADA',
    notes: 'AVISAR A MI FAMILIA',
  }
  it('groups each contact on one line and includes all requested headings', () => {
    expect(formatQrData(data).text).toBe(
      [
        'NOMBRE: ANA',
        'CONTACTO-1: LUIS 5512345678',
        'SANGRE: O+',
        'NACIMIENTO: 1990',
        'INFO-MEDICA: ALERGIA: PENICILINA',
        'SEGURO: IMSS',
        'CONTACTO-2: SOFIA 5598765432',
        'NOTAS: AVISAR A MI FAMILIA',
      ].join('\n'),
    )
  })
  it.each([
    ['', '', null],
    ['SOFIA', '', 'CONTACTO-2: SOFIA'],
    ['', '5598765432', 'CONTACTO-2: 5598765432'],
  ])(
    'preserves a partial optional contact without extra spaces',
    (contact2, phone2, expected) => {
      const line = formatQrData({ ...data, contact2, phone2 })
        .text.split('\n')
        .find((line) => line.startsWith('CONTACTO-2:'))
      expect(line ?? null).toBe(expected)
    },
  )
  it('does not imply missing medical details mean there are no conditions', () => {
    expect(formatQrData({ ...data, conditions: '' }).text).toContain(
      'SIN DATOS MEDICOS REGISTRADOS',
    )
  })
})
