import { createQrSvg } from '@/lib/qr/createQrSvg'
import { getQrPrintSizing } from '@/lib/qr/getQrPrintAnalysis'
export function createPrintableQr(value) {
  const model = createQrSvg(value)
  return { ...model, ...getQrPrintSizing(value, model.totalModules) }
}
