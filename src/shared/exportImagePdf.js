import { imagePrintPositions } from '@/shared/imagePrintPositions'

export async function exportImagePdf(blob, widthCm, heightCm, repeat = false) {
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'cm',
    format: 'letter',
    compress: true,
  })
  const image = new Uint8Array(await blob.arrayBuffer())
  for (const { x, y } of imagePrintPositions(widthCm, heightCm, repeat))
    pdf.addImage(image, 'PNG', x, y, widthCm, heightCm, 'piece', 'FAST')
  return pdf.output('blob')
}
