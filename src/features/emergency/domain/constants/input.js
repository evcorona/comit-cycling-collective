// Printable ASCII in uppercase, plus line breaks for readable medical text.
export const ALLOWED_TEXT_CHARACTERS =
  'A-Z0-9\\x20-\\x40\\x5b-\\x60\\x7b-\\x7e\\r\\n'
export const ALLOWED_TEXT_PATTERN = new RegExp(
  `^[${ALLOWED_TEXT_CHARACTERS}]*$`,
)
export const NAME_CHARACTERS = 'A-Z '
export const NAME_PATTERN = /^[A-Z ]*$/

export function createTextMask(maxLength, lettersOnly = false) {
  return new RegExp(
    `^[${lettersOnly ? NAME_CHARACTERS : ALLOWED_TEXT_CHARACTERS}]{0,${maxLength}}$`,
  )
}
