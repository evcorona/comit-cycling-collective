export function resizeQrSvg(svg, size) {
  return svg
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`)
}
export const svgImageSource = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
