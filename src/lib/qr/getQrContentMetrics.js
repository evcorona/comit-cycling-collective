import { QR_LIMITS } from '@/lib/qr/constants'
import { getUtf8ByteLength } from '@/lib/qr/getUtf8ByteLength'
import { getQrEncodingMode } from '@/lib/qr/getQrEncodingMode'

export function getQrContentMetrics(value, physicalSizeCm) {
  const limit = QR_LIMITS[physicalSizeCm]
  if (!limit) throw new RangeError('Unsupported QR size')
  const byteLength = getUtf8ByteLength(value)
  const characterCount = Array.from(value).length
  const mode = getQrEncodingMode(value)
  const maximumLimit =
    mode === 'byte'
      ? limit.maxBytesM
      : mode === 'numeric'
        ? limit.maxNumericM
        : limit.maxAlphanumericM
  const recommendedLimit =
    mode === 'byte'
      ? limit.recommendedBytes
      : Math.floor((maximumLimit * limit.recommendedBytes) / limit.maxBytesM)
  return {
    mode,
    byteLength,
    characterCount,
    contentLength: mode === 'byte' ? byteLength : characterCount,
    recommendedLimit,
    maximumLimit,
    unit: mode === 'byte' ? 'bytes' : 'characters',
  }
}
