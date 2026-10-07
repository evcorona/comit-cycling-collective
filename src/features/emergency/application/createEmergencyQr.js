import { formatEmergencyData } from '@/features/emergency/domain/formatEmergencyData'
import { formatQrData } from '@/features/emergency/domain/formatQrData'
export async function createEmergencyQr(data, encodeImage, getPrintSizing) {
  const qrs = await Promise.all(
    formatQrData(data).map(async (qr) => ({
      ...qr,
      ...getPrintSizing(qr.text),
      image: await encodeImage(qr.text),
    })),
  )
  return { qrs, text: formatEmergencyData(data), data: { ...data } }
}
