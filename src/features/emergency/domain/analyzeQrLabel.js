import {
  getQrPrintAnalysis,
  getMinimumQrModulePixels,
} from '@/lib/qr/getQrPrintAnalysis'
import { qrLabelLayout } from '@/features/emergency/domain/qrLabelLayout'

export function analyzeQrLabel(value, sizeCm, totalModules) {
  const analysis = getQrPrintAnalysis(value, sizeCm, totalModules)
  const layout = qrLabelLayout(sizeCm, totalModules)
  const canDownload =
    analysis.canPrint &&
    analysis.status === 'optimal' &&
    layout.qrPixels / totalModules >= getMinimumQrModulePixels()
  return { ...analysis, ...layout, canDownload }
}
