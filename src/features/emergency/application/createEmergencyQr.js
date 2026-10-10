import { normalizeInsurance } from '@/features/emergency/domain/normalizeInsurance'
import { selectEmergencyQr } from '@/features/emergency/application/selectEmergencyQr'
import { formatVCardData } from '@/features/emergency/domain/formatVCardData'
export async function createEmergencyQr(data, encodeQr) {
  data = normalizeInsurance(data)
  const qrData = { ...data, notes: '' }
  const content = formatVCardData(qrData)
  const qr = { ...content, ...(await encodeQr(content.text)) }
  const qrBySize = {}
  for (const size of [3, 4, 5, 6])
    qrBySize[size] = await selectEmergencyQr(
      qrData,
      size,
      encodeQr,
      formatVCardData,
    )
  return { qr, qrBySize, data: { ...data } }
}
