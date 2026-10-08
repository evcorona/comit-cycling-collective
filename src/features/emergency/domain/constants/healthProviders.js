import texts from '@/locales/es.json'
import { sanitizeEmergencyText } from '@/features/emergency/domain/sanitizeEmergencyText'

export const healthProviders = texts.healthProviders.options
export function isPublicHealthProvider(value) {
  const normalized = sanitizeEmergencyText(value)
    .replace(/[-\s]+/g, ' ')
    .trim()
  return healthProviders.some(
    (item) => item.type === 'public' && item.value === normalized,
  )
}
export function filterHealthProviders(value) {
  const query = sanitizeEmergencyText(value).trim()
  return healthProviders.filter((item) =>
    sanitizeEmergencyText(item.label).includes(query),
  )
}
