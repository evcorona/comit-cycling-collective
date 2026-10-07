import { medicalFieldNames } from '@/features/emergency/domain/constants/fields'
export const CARD_WIDTH_CM = 8.56
export const CARD_HEIGHT_CM = 5.4
export const CARD_FRONT_ROWS = [
  [{ label: 'name', fields: ['name'] }],
  [
    { label: 'birthDate', fields: ['birthDate'] },
    { label: 'bloodType', fields: ['bloodType'] },
  ],
  [{ label: 'contact', fields: ['contact', 'phone'] }],
  [{ label: 'contact2', fields: ['contact2', 'phone2'] }],
]
export const CARD_BACK_ROWS = [
  [{ label: 'name', fields: ['name'] }],
  ...[...medicalFieldNames, 'notes'].map((name) => [
    { label: name, fields: [name] },
  ]),
]
export const CARD_STYLE = {
  padding: 40,
  bodyTop: 138,
  bottomSpace: 64,
  labelHeight: 22,
  labelGap: 6,
  rowGap: 10,
  columnGap: 24,
  minFontSize: 18,
  maxFontSize: 32,
  noticeFontSize: 24,
  lineHeightFactor: 1.25,
}
