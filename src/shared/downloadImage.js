export function downloadImage(image, filename) {
  const link = document.createElement('a')
  link.href = image
  link.download = filename
  link.click()
}
