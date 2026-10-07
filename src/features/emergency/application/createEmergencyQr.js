import { createVCard } from '@/features/emergency/domain/createVCard'
import { formatEmergencyData } from '@/features/emergency/domain/formatEmergencyData'
export async function createEmergencyQr(data, encodeImage, format = 'text') {
  const text = formatEmergencyData(data)
  const encodedText = format === 'vcard' ? createVCard(data) : text
  const image = await encodeImage(encodedText)
  return { image, text, encodedText, format, data: { ...data } }
}
