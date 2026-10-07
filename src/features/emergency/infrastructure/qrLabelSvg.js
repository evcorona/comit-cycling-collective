import { QR_LABEL } from '@/features/emergency/domain/constants/qrLabel'
import { analyzeQrLabel } from '@/features/emergency/domain/analyzeQrLabel'
import { cmToPrintPixels } from '@/lib/qr/printUnits'

let logoPromise
function loadLogo() {
  logoPromise ??= fetch('/comit_words.png')
    .then((response) => {
      if (!response.ok) throw new Error('Logo unavailable')
      return response.blob()
    })
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        }),
    )
    .catch((error) => {
      logoPromise = undefined
      throw error
    })
  return logoPromise
}

export async function qrLabelSvg(qr, sizeCm) {
  const layout = analyzeQrLabel(qr.text, sizeCm, qr.totalModules)
  const logo = await loadLogo()
  const inset = cmToPrintPixels(QR_LABEL.borderInsetCm)
  const qrSvg = qr.svg
    .replace(/width="[^"]*"/, `width="${layout.qrPixels}"`)
    .replace(/height="[^"]*"/, `height="${layout.qrPixels}"`)
    .replace('<svg ', `<svg x="${layout.qrX}" y="${layout.qrY}" `)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${sizeCm}cm" height="${sizeCm}cm" viewBox="0 0 ${layout.size} ${layout.size}">
<rect width="100%" height="100%" fill="white"/>
<image href="${logo}" x="${layout.logoX}" y="${layout.logoY}" width="${layout.logoWidth}" height="${layout.logoHeight}"/>
${qrSvg}
<rect x="${inset}" y="${inset}" width="${layout.size - inset * 2}" height="${layout.size - inset * 2}" rx="${cmToPrintPixels(QR_LABEL.cornerCm)}" fill="none" stroke="#888" stroke-width="${cmToPrintPixels(QR_LABEL.borderWidthCm)}" stroke-dasharray="${cmToPrintPixels(QR_LABEL.dashCm)}"/>
</svg>`
}
