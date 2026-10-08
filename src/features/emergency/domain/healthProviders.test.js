import { describe, expect, it } from 'vitest'
import {
  healthProviders,
  isPublicHealthProvider,
  filterHealthProviders,
} from '@/features/emergency/domain/constants/healthProviders'
import { formSchema } from '@/features/emergency/domain/schema/emergencySchema'
import { normalizeInsurance } from '@/features/emergency/domain/normalizeInsurance'
import { defaultValues } from '@/features/emergency/domain/constants/fields'
import { createEmergencyQr } from '@/features/emergency/application/createEmergencyQr'
import { createPrintableQr } from '@/features/emergency/infrastructure/createPrintableQr'

const data = {
  ...defaultValues,
  name: 'ANA',
  contact: 'LUIS',
  phone: '5512345678',
  insurer: 'IMSS',
  insurancePlan: 'VIEJO PLAN',
  policy: 'VIEJA POLIZA',
}
describe('health provider suggestions and hidden public insurance fields', () => {
  it.each([
    'IMSS',
    'ISSSTE',
    'IMSS BIENESTAR',
    'imss-bienestar',
    'Secretaría de Salud',
    'PEMEX',
    'SEDENA',
    'SEMAR',
  ])('recognizes public institution %s', (value) =>
    expect(isPublicHealthProvider(value)).toBe(true),
  )
  it('allows private and unlisted providers without dropping their plans', () => {
    expect(normalizeInsurance({ ...data, insurer: 'OTRO SEGURO' }).policy).toBe(
      'VIEJA POLIZA',
    )
    expect(isPublicHealthProvider('GNP')).toBe(false)
    expect(isPublicHealthProvider('IMSS OTRO')).toBe(false)
  })
  it('searches names without case or accent differences', () => {
    expect(filterHealthProviders('secretaria')[0].value).toBe(
      'SECRETARIA DE SALUD',
    )
    expect(filterHealthProviders('otra compañia')).toEqual([])
  })
  it('keeps every selectable value valid for the masked field and schema', () => {
    for (const item of healthProviders)
      expect(
        formSchema.safeParse({ ...data, insurer: item.value }).success,
      ).toBe(true)
    expect(new Set(healthProviders.map((item) => item.value)).size).toBe(
      healthProviders.length,
    )
  })
  it('clears hidden values in schema and application so the card cannot show them', async () => {
    expect(formSchema.parse(data)).toMatchObject({
      insurancePlan: '',
      policy: '',
    })
    const result = await createEmergencyQr(data, createPrintableQr)
    expect(result.data).toMatchObject({
      insurer: 'IMSS',
      insurancePlan: '',
      policy: '',
    })
    expect(data.policy).toBe('VIEJA POLIZA')
  })
})

describe('optional public affiliation number', () => {
  it('accepts free ASCII text instead of forcing an 11-digit NSS', () => {
    const result = formSchema.parse({ ...data, affiliation: 'AB-12/34' })
    expect(result.affiliation).toBe('AB-12/34')
    expect(formSchema.parse({ ...data, affiliation: '' }).affiliation).toBe('')
  })
  it('keeps public affiliation card-only and drops it for private providers', async () => {
    const publicResult = await createEmergencyQr(
      { ...data, affiliation: 'AB-123' },
      createPrintableQr,
    )
    expect(publicResult.data.affiliation).toBe('AB-123')
    expect(publicResult.qr.text).not.toContain('AB-123')
    expect(
      normalizeInsurance({ ...data, insurer: 'GNP', affiliation: 'ANTERIOR' })
        .affiliation,
    ).toBe('')
  })
})
