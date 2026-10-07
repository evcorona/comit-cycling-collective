export const PRINT_DPI = 300
export const CM_PER_INCH = 2.54
export const MIN_EXPORT_CM = 1
export const MAX_EXPORT_CM = 30
export function printPixels(sizeCm) {
  return Math.round((sizeCm / CM_PER_INCH) * PRINT_DPI)
}
