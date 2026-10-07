import { formatQrData } from '@/features/emergency/domain/formatQrData'
export async function createEmergencyQr(data, encodeQr) {
  const content = formatQrData(data)
  const qr = { ...content, ...(await encodeQr(content.text)) }
  return { qr, data: { ...data } }
}
