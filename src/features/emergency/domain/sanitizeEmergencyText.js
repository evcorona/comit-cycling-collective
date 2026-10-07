import { FORBIDDEN_TEXT_CHARACTERS } from '@/features/emergency/domain/constants/input'
import { stripDiacritics } from '@/shared/stripDiacritics'

export function sanitizeEmergencyText(value) {
  return stripDiacritics(value).replace(
    new RegExp(`[${FORBIDDEN_TEXT_CHARACTERS}]`, 'gi'),
    '',
  )
}
