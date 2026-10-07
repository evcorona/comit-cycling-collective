import { getQrContentMetrics } from '@/lib/qr/getQrContentMetrics'
/** @returns {'optimal' | 'warning' | 'over-limit'} */
export function getQrContentStatus(value, physicalSizeCm) {
  const { contentLength, recommendedLimit, maximumLimit } = getQrContentMetrics(
    value,
    physicalSizeCm,
  )
  if (contentLength <= recommendedLimit) return 'optimal'
  return contentLength <= maximumLimit ? 'warning' : 'over-limit'
}
