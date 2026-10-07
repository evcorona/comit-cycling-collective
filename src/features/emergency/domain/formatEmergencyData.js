import { stripDiacritics } from '@/shared/stripDiacritics'
import texts from '@/locales/es.json'
import { emergencyFields } from '@/features/emergency/domain/constants/fields'
export function formatEmergencyData(data) {
  return stripDiacritics(
    [
      texts.qr.heading,
      ...emergencyFields
        .filter(({ name }) => data[name].trim())
        .map(({ name, label }) => `${label}: ${data[name].trim()}`),
    ].join('\n'),
  )
}
