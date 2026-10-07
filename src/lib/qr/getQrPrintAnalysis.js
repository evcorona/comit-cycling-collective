import {
  QR_PHYSICAL_SIZES,
  QR_MIN_MODULE_MM,
  QR_LIMITS,
} from '@/lib/qr/constants'
import { PRINT_DPI, CM_PER_INCH, MM_PER_CM } from '@/lib/qr/printUnits'
import { getRecommendedQrSize } from '@/lib/qr/getRecommendedQrSize'
import { getQrContentStatus } from '@/lib/qr/getQrContentStatus'
import { getQrMatrixMetrics } from '@/lib/qr/getQrMatrixMetrics'

export function getMinimumQrModulePixels() {
  return Math.ceil((QR_MIN_MODULE_MM * PRINT_DPI) / (CM_PER_INCH * MM_PER_CM))
}
export function getQrPrintSizing(value, totalModules) {
  const modulePixels = getMinimumQrModulePixels()
  const minimumCm =
    Math.ceil(
      ((totalModules * modulePixels * CM_PER_INCH) / PRINT_DPI) * MM_PER_CM,
    ) / MM_PER_CM
  const content = getRecommendedQrSize(value)
  const recommendedCm =
    QR_PHYSICAL_SIZES.find(
      (size) =>
        size >=
        Math.max(minimumCm, content.physicalSizeCm ?? QR_PHYSICAL_SIZES.at(-1)),
    ) ?? null
  return { minimumCm, recommendedCm }
}
export function getQrPrintAnalysis(value, physicalSizeCm, totalModules) {
  const status = getQrContentStatus(value, physicalSizeCm)
  const sizing = getQrPrintSizing(value, totalModules)
  const isTooSmall = physicalSizeCm < sizing.minimumCm
  const { version } = getQrMatrixMetrics(`0 0 ${totalModules} ${totalModules}`)
  const exceedsVersion = version > QR_LIMITS[physicalSizeCm].version
  return {
    ...sizing,
    status,
    isTooSmall,
    exceedsVersion,
    canPrint: !isTooSmall && !exceedsVersion,
  }
}
