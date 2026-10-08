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
  ...medicalFieldNames.map((name) => [{ label: name, fields: [name] }]),
  [
    { label: 'insurer', fields: ['insurer'] },
    { label: 'insurancePlan', fields: ['insurancePlan'] },
    { label: 'policy', fields: ['policy'] },
    { label: 'affiliation', fields: ['affiliation'] },
  ],
  [{ label: 'notes', fields: ['notes'] }],
]
export const CARD_STYLE = {
  padding: 36,
  bodyTop: 120,
  bottomSpace: 54,
  labelHeight: 30,
  labelGap: 4,
  rowGap: 5,
  columnGap: 24,
  minFontSize: 38,
  maxFontSize: 40,
  noticeFontSize: 38,
  lineHeightFactor: 1.12,
}
