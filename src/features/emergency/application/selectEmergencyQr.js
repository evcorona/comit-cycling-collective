import { formatQrData } from '@/features/emergency/domain/formatQrData'
import { getQrPrintAnalysis } from '@/lib/qr/getQrPrintAnalysis'

// Keep basic identification intact; add optional fields only in priority order.
export async function selectEmergencyQr(data, size, encodeQr) {
  const selected = { ...data, conditions: '', notes: '' }
  async function encode(values) {
    const content = formatQrData(values, { includeMedicalNotice: false })
    return { ...content, ...(await encodeQr(content.text)) }
  }
  let qr = await encode(selected)
  const included = []
  if (size > 3)
    for (const field of ['conditions', 'notes']) {
      if (!data[field]?.trim()) continue
      const candidate = await encode({ ...selected, [field]: data[field] })
      const analysis = getQrPrintAnalysis(
        candidate.text,
        size,
        candidate.totalModules,
      )
      if (!analysis.canPrint || analysis.status !== 'optimal') break
      selected[field] = data[field]
      included.push(field)
      qr = candidate
    }

  return {
    ...qr,
    included,
    omitted: ['conditions', 'notes'].filter(
      (field) => data[field]?.trim() && !included.includes(field),
    ),
  }
}
