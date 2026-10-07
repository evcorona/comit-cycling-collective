import { selectEmergencyQr } from '@/features/emergency/application/selectEmergencyQr'
import { formatQrData } from '@/features/emergency/domain/formatQrData'
export async function createEmergencyQr(data, encodeQr) {
  const content = formatQrData(data)
  const qr = { ...content, ...(await encodeQr(content.text)) }
  const qrBySize = {}
  for (const size of [3, 4, 5, 6])
    qrBySize[size] = await selectEmergencyQr(data, size, encodeQr)
  return { qr, qrBySize, data: { ...data } }
}
