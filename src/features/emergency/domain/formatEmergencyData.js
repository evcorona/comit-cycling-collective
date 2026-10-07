import { emergencyFields } from '@/features/emergency/domain/constants/fields'
export function formatEmergencyData(data) {
  return [
    'INFORMACION DE EMERGENCIA',
    ...emergencyFields
      .filter(({ name }) => data[name].trim())
      .map(({ name, label }) => `${label}: ${data[name].trim()}`),
  ].join('\n')
}
