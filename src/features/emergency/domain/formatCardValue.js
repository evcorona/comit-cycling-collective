export function formatCardValue(name, value) {
  const text = value?.trim() || ''
  if (name === 'phone' || name === 'phone2') {
    const digits = text.replace(/\D/g, '')
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3')
  }
  return text
}
