import texts from '@/locales/es.json'
import { stripDiacritics } from '@/shared/stripDiacritics'
import { formatEmergencyData } from '@/features/emergency/domain/formatEmergencyData'

function escapeValue(value) {
  return stripDiacritics(value)
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}
function foldLine(line) {
  const encoder = new TextEncoder()
  let output = ''
  let length = 0
  for (const character of line) {
    const bytes = encoder.encode(character).length
    if (length + bytes > 75) {
      output += '\r\n '
      length = 1
    }
    output += character
    length += bytes
  }
  return output
}
export function createVCard(data) {
  const name = escapeValue(
    texts.qrFormat.contactName.replace('{name}', data.name),
  )
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${name};;;`,
    `FN:${name}`,
    ...[data.phone, data.phone2]
      .filter(Boolean)
      .map((phone) => `TEL;TYPE=CELL:${phone.replace(/\D/g, '')}`),
    `NOTE:${escapeValue(formatEmergencyData(data))}`,
    'END:VCARD',
  ]
    .map(foldLine)
    .join('\r\n')
}
