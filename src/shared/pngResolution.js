// PNG pHYs records pixels per meter so image editors can retain print size.
const PHYS_TYPE = new Uint8Array([112, 72, 89, 115])
function crc32(bytes) {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return (crc ^ 0xffffffff) >>> 0
}
export function withPngResolution(dataUrl, dpi) {
  const bytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (char) =>
    char.charCodeAt(0),
  )
  const chunk = new Uint8Array(21)
  const view = new DataView(chunk.buffer)
  view.setUint32(0, 9)
  chunk.set(PHYS_TYPE, 4)
  const pixelsPerMeter = Math.round(dpi / 0.0254)
  view.setUint32(8, pixelsPerMeter)
  view.setUint32(12, pixelsPerMeter)
  chunk[16] = 1
  view.setUint32(17, crc32(chunk.subarray(4, 17)))
  // Insert after IHDR, preserving every original chunk and its checksum.
  const output = new Uint8Array(bytes.length + chunk.length)
  output.set(bytes.subarray(0, 33))
  output.set(chunk, 33)
  output.set(bytes.subarray(33), 54)
  return new Blob([output], { type: 'image/png' })
}
