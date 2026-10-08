import { LETTER_PAGE } from '@/shared/constants/print'

export function imagePrintPositions(widthCm, heightCm, repeat = false) {
  const {
    widthCm: pageWidth,
    heightCm: pageHeight,
    marginCm,
    gapCm,
  } = LETTER_PAGE
  const columns = repeat
    ? Math.floor((pageWidth - marginCm * 2 + gapCm) / (widthCm + gapCm))
    : 1
  const rows = repeat
    ? Math.floor((pageHeight - marginCm * 2 + gapCm) / (heightCm + gapCm))
    : 1
  if (
    !columns ||
    !rows ||
    widthCm > pageWidth - marginCm * 2 ||
    heightCm > pageHeight - marginCm * 2
  )
    throw new RangeError('Image does not fit letter paper')
  return Array.from({ length: rows * columns }, (_, index) => ({
    x: marginCm + (index % columns) * (widthCm + gapCm),
    y: marginCm + Math.floor(index / columns) * (heightCm + gapCm),
  }))
}
