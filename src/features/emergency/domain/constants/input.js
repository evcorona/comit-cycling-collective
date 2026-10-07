export const FORBIDDEN_TEXT_CHARACTERS = '\\u0300-\\u036f→•✓—ñáéíóú'
export const ALLOWED_TEXT_PATTERN = new RegExp(
  `^[^${FORBIDDEN_TEXT_CHARACTERS}]*$`,
  'i',
)
export function createTextMask(maxLength) {
  return new RegExp(`^[^${FORBIDDEN_TEXT_CHARACTERS}]{0,${maxLength}}$`, 'i')
}
