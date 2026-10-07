export function wrapCanvasText(context, text, maxWidth) {
  const lines = []
  for (const paragraph of text.split('\n')) {
    let line = ''
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word
      if (context.measureText(candidate).width <= maxWidth) {
        line = candidate
        continue
      }
      if (line) lines.push(line)
      line = ''
      // Preserve even long unbroken values without clipping the card.
      for (const character of word) {
        if (line && context.measureText(line + character).width > maxWidth) {
          lines.push(line)
          line = ''
        }
        line += character
      }
    }
    lines.push(line)
  }
  return lines
}
