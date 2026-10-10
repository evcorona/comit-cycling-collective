import { formatQrData } from '@/features/emergency/domain/formatQrData'
import { stripDiacritics } from '@/shared/stripDiacritics'

function escapeValue(value = '') {
  return stripDiacritics(value.trim())
    .toUpperCase()
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

// Fold vCard 3.0 content lines at 75 ASCII octets, using CRLF continuations.
function foldLine(line) {
  const parts = [line.slice(0, 75)]
  for (let index = 75; index < line.length; index += 74)
    parts.push(` ${line.slice(index, index + 74)}`)
  return parts.join('\r\n')
}

export function formatVCardData(data) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${escapeValue(data.name)};;;`,
    `FN:${escapeValue(data.name)}`,
  ]
  for (const [index, name, phone] of [
    [1, data.contact, data.phone],
    [2, data.contact2, data.phone2],
  ]) {
    const digits = phone?.replace(/\D/g, '')
    if (!digits) continue
    lines.push(`item${index}.TEL;TYPE=VOICE:${digits}`)
    lines.push(`item${index}.X-ABLabel:EMERGENCIA - ${escapeValue(name)}`)
  }
  // Medical and contact details use vCard NOTE; the user's Notes field is excluded.
  const details = formatQrData(
    { ...data, notes: '' },
    { includeMedicalNotice: false },
  )
  lines.push(`NOTE:${escapeValue(details.text)}`, 'END:VCARD')
  return {
    id: 'vcard',
    title: details.title,
    displayText: details.text,
    text: `${lines.map(foldLine).join('\r\n')}\r\n`,
  }
}
