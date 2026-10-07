import { encodeQrImage } from '@/features/emergency/infrastructure/qrImage'
import {
  PRINT_DPI,
  printPixels,
} from '@/features/emergency/domain/constants/export'
import { withPngResolution } from '@/shared/pngResolution'
export async function exportQr(text, sizeCm) {
  const image = await encodeQrImage(text, printPixels(sizeCm))
  return withPngResolution(image, PRINT_DPI)
}
