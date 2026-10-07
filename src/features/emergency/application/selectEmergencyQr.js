import { formatQrData } from '@/features/emergency/domain/formatQrData'
import { analyzeQrLabel } from '@/features/emergency/domain/analyzeQrLabel'

// Keep basic identification intact; add optional fields only in priority order.
export async function selectEmergencyQr(data, size, encodeQr) {
  const selected = { ...data, conditions: '', notes: '' }
  async function encode(values) {
    const content = formatQrData(values, { includeMedicalNotice: false })
    return { ...content, ...(await encodeQr(content.text)) }
  }
  let qr = await encode(selected)
  const included = []
  for (const field of ['conditions', 'notes']) {
    if (!data[field]?.trim()) continue
    const candidate = await encode({ ...selected, [field]: data[field] })
    const analysis = analyzeQrLabel(
      candidate.text,
      size,
      candidate.totalModules,
    )
    if (!analysis.canDownload) break
    selected[field] = data[field]
    included.push(field)
    qr = candidate
  }

  const analysis = analyzeQrLabel(qr.text, size, qr.totalModules)
  return {
    ...qr,
    canDownload: analysis.canDownload,
    included,
    omitted: ['conditions', 'notes'].filter(
      (field) => data[field]?.trim() && !included.includes(field),
    ),
  }
}
