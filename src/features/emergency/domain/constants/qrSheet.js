import { LETTER_PAGE } from '@/shared/constants/print'
export const QR_SHEET = {
  ...LETTER_PAGE,
  marginCm: 1,
  topCm: 2,
  gapCm: 0.15,
  rows: [
    [6, 6, 3],
    [5, 5, 4],
    [4, 4, 3, 3],
    [3, 3, 3, 3, 3],
  ],
}
