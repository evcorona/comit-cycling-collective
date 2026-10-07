import { stripDiacritics } from '@/shared/stripDiacritics'
import texts from '@/locales/es.json'
import { emergencyFields } from '@/features/emergency/domain/constants/fields'
export function formatEmergencyData(data) {
  return stripDiacritics(
    [
      texts.qr.heading,
      ...emergencyFields
        .filter(({ name }) => data[name].trim())
        .map(
          ({ name, label, type }) =>
            `${label}: ${type === 'tel' ? data[name].replace(/\D/g, '') : data[name].trim()}`,
        ),
    ].join('\n'),
  )
}
