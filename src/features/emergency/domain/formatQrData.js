import texts from '@/locales/es.json'
import { emergencyFields } from '@/features/emergency/domain/constants/fields'
import { QR_CONTENT_ROWS } from '@/features/emergency/domain/constants/qr'
import { stripDiacritics } from '@/shared/stripDiacritics'
export function formatQrData(data, { includeMedicalNotice = true } = {}) {
  const lines = QR_CONTENT_ROWS.map(({ label, fields }) => {
    const values = fields
      .map((name) => {
        const value = data[name]?.trim() || ''
        const field = emergencyFields.find((item) => item.name === name)
        if (name === 'birthDate') return value.split('-')[0]
        return field.type === 'tel' ? value.replace(/\D/g, '') : value
      })
      .filter(Boolean)
    return values.length
      ? `${texts.qr.fields[label]}: ${values.join(' ')}`
      : null
  }).filter(Boolean)
  if (includeMedicalNotice && !data.conditions?.trim())
    lines.push(texts.qr.noMedicalData)
  return {
    id: 'emergencia',
    title: texts.qr.titles.emergency,
    text: stripDiacritics(lines.join('\n')).toUpperCase(),
  }
}
