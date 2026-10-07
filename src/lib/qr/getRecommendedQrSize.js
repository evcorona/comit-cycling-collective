import { QR_PHYSICAL_SIZES } from '@/lib/qr/constants'
import { getQrContentMetrics } from '@/lib/qr/getQrContentMetrics'
export function getRecommendedQrSize(value) {
  const physicalSizeCm =
    QR_PHYSICAL_SIZES.find((size) => {
      const metrics = getQrContentMetrics(value, size)
      return metrics.contentLength <= metrics.recommendedLimit
    }) ?? null
  const metrics = getQrContentMetrics(
    value,
    physicalSizeCm ?? QR_PHYSICAL_SIZES.at(-1),
  )
  return {
    status: physicalSizeCm ? 'supported' : 'unsupported',
    physicalSizeCm,
    byteLength: metrics.byteLength,
    recommendedLimit: metrics.recommendedLimit,
    limitUnit: metrics.unit,
    mode: metrics.mode,
  }
}
