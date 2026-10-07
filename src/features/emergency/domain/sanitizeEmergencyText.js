import { stripDiacritics } from '@/shared/stripDiacritics'
export function sanitizeEmergencyText(value) {
  return stripDiacritics(value)
    .toUpperCase()
    .replace(/[→•✓]/g, ' ')
    .replace(/—/g, '-')
    .replace(/[^\x20-\x7e\r\n]/g, '')
}
