import { formatQrData } from '@/features/emergency/domain/formatQrData'
import { analyzeQrLabel } from '@/features/emergency/domain/analyzeQrLabel'
import {
  QR_REQUIRED_FIELDS,
  QR_PRIORITY_GROUPS,
} from '@/features/emergency/domain/constants/qr'

// Keep name and primary contact intact; add complete groups in priority order.
export async function selectEmergencyQr(
  data,
  size,
  encodeQr,
  formatContent = formatQrData,
) {
  const selected = Object.fromEntries(
    QR_REQUIRED_FIELDS.map((field) => [field, data[field]]),
  )
  async function encode(values) {
    const content = formatContent(values, { includeMedicalNotice: false })
    return { ...content, ...(await encodeQr(content.text)) }
  }
  let qr = await encode(selected)
  const included = []
  for (const group of QR_PRIORITY_GROUPS) {
    const fields = group.filter((field) => data[field]?.trim())
    if (!fields.length) continue
    const additions = Object.fromEntries(
      fields.map((field) => [field, data[field]]),
    )
    const candidate = await encode({ ...selected, ...additions })
    const analysis = analyzeQrLabel(
      candidate.text,
      size,
      candidate.totalModules,
    )
    if (!analysis.canDownload) break
    Object.assign(selected, additions)
    included.push(...fields)
    qr = candidate
  }
  const analysis = analyzeQrLabel(qr.text, size, qr.totalModules)
  return {
    ...qr,
    canDownload: analysis.canDownload,
    included,
    omitted: QR_PRIORITY_GROUPS.flat().filter(
      (field) => data[field]?.trim() && !included.includes(field),
    ),
  }
}
