import { QR_ALPHANUMERIC_REGEX } from '@/lib/qr/constants'
export const isQrAlphanumeric = (value) => QR_ALPHANUMERIC_REGEX.test(value)
export const getQrEncodingMode = (value) =>
  /^\d+$/.test(value)
    ? 'numeric'
    : isQrAlphanumeric(value)
      ? 'alphanumeric'
      : 'byte'
