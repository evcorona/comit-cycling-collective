import { LETTER_PAGE } from '@/shared/constants/print'

export async function exportImagePdf(blob, widthCm, heightCm) {
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'cm',
    format: 'letter',
    compress: true,
  })
  pdf.addImage(
    new Uint8Array(await blob.arrayBuffer()),
    'PNG',
    LETTER_PAGE.marginCm,
    LETTER_PAGE.marginCm,
    widthCm,
    heightCm,
    undefined,
    'FAST',
  )
  return pdf.output('blob')
}
