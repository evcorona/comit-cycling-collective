export const PRINT_DPI = 300
export const CM_PER_INCH = 2.54
export const MM_PER_CM = 10
export function cmToPrintPixels(sizeCm) {
  return Math.round((sizeCm / CM_PER_INCH) * PRINT_DPI)
}
