import { describe, expect, it } from 'vitest'
import { formatVCardData } from '@/features/emergency/domain/formatVCardData'
import { selectEmergencyQr } from '@/features/emergency/application/selectEmergencyQr'
import { createPrintableQr } from '@/features/emergency/infrastructure/createPrintableQr'

const data = {
  name: 'ANA',
  contact: 'LUIS',
  phone: '55-1234-5678',
  bloodType: 'O+',
  birthDate: '1990-05-12',
  conditions: 'ALERGIA A PENICILINA',
  insurer: 'IMSS',
  contact2: 'SOFIA',
  phone2: '55-9876-5432',
  notes: 'NOTA QUE NO DEBE APARECER',
  policy: 'POLIZA PRIVADA',
}
const unfold = (text) => text.replace(/\r\n /g, '')

describe('emergency vCard QR', () => {
  it('encodes a vCard 3.0 with callable emergency phones and excludes user notes', () => {
    const text = unfold(formatVCardData(data).text)
    expect(text).toContain('BEGIN:VCARD\r\nVERSION:3.0\r\n')
    expect(text).toContain('N:;ANA;;;\r\nFN:ANA\r\n')
    expect(text).toContain('item1.TEL;TYPE=VOICE:5512345678')
    expect(text).toContain('item2.TEL;TYPE=VOICE:5598765432')
    expect(text).toContain('item1.X-ABLabel:EMERGENCIA - LUIS')
    expect(text).toContain('INFO-MEDICA: ALERGIA A PENICILINA')
    expect(text).toContain('NACIMIENTO: 1990')
    expect(text).not.toContain(data.notes)
    expect(text).not.toContain(data.policy)
    expect(text).toMatch(/END:VCARD\r\n$/)
    expect(text).not.toContain('\\nEMERGENCIA\r\nEND:VCARD')
  })
  it('escapes punctuation and folds long ASCII lines without corrupting values', () => {
    const name = 'ANA;LOPEZ,TEST\\NAME'
    const result = formatVCardData({
      ...data,
      name,
      conditions: 'W'.repeat(100),
    })
    expect(unfold(result.text)).toContain('FN:ANA\\;LOPEZ\\,TEST\\\\NAME')
    expect(result.text.split('\r\n').every((line) => line.length <= 75)).toBe(
      true,
    )
    expect(unfold(result.text)).toContain('W'.repeat(100))
  })
  it('applies real vCard capacity and never adds notes while selecting priorities', async () => {
    const qr = await selectEmergencyQr(
      { ...data, notes: '' },
      6,
      createPrintableQr,
      formatVCardData,
    )
    expect(qr.canDownload).toBe(true)
    expect(qr.included).toEqual([
      'bloodType',
      'birthDate',
      'conditions',
      'insurer',
      'contact2',
      'phone2',
    ])
    expect(unfold(qr.text)).not.toContain(data.notes)
    expect(qr.text).toContain('BEGIN:VCARD')
    expect(data.notes).toBe('NOTA QUE NO DEBE APARECER')
  })
})
