export function stripDiacritics(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '')
}
