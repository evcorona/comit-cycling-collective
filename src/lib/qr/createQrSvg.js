import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { QRCodeSVG } from 'qrcode.react'
import { getQrMatrixMetrics } from '@/lib/qr/getQrMatrixMetrics'
import {
  QR_DEFAULT_LEVEL,
  QR_LEVELS,
  QR_RENDER_OPTIONS,
  QR_PREVIEW_SIZE,
} from '@/lib/qr/constants'

export function createQrSvg(
  value,
  { errorCorrection = QR_DEFAULT_LEVEL, size = QR_PREVIEW_SIZE } = {},
) {
  if (!QR_LEVELS.includes(errorCorrection))
    throw new RangeError('Unsupported QR correction level')
  const svg = renderToStaticMarkup(
    createElement(QRCodeSVG, {
      ...QR_RENDER_OPTIONS,
      value,
      level: errorCorrection,
      size,
    }),
  )
  const metrics = getQrMatrixMetrics(svg.match(/viewBox="([^"]+)"/)?.[1])
  return {
    svg,
    ...metrics,
  }
}
