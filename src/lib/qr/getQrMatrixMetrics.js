import {
  QR_MARGIN_MODULES,
  QR_VERSION_BASE_MODULES,
  QR_VERSION_MODULE_STEP,
} from '@/lib/qr/constants'
export function getQrMatrixMetrics(viewBox) {
  const totalModules = Number(viewBox?.match(/^0 0 (\d+) (\d+)$/)?.[1])
  if (!totalModules) throw new Error('QR matrix unavailable')
  const modules = totalModules - QR_MARGIN_MODULES * 2
  return {
    totalModules,
    modules,
    version: (modules - QR_VERSION_BASE_MODULES) / QR_VERSION_MODULE_STEP,
  }
}
