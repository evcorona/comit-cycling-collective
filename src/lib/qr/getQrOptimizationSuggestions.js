import { isQrAlphanumeric } from '@/lib/qr/getQrEncodingMode'
export function getQrOptimizationSuggestions(value) {
  if (isQrAlphanumeric(value)) return []
  const suggestions = []
  if (/[a-z]/.test(value)) suggestions.push('uppercase')
  if (/[^\x20-\x7e\r\n]/.test(value)) suggestions.push('ascii')
  if (/[\r\n]/.test(value)) suggestions.push('lineBreaks')
  if (/[^0-9A-Z $%*+\-./:\r\n]/.test(value)) suggestions.push('punctuation')
  return suggestions
}
