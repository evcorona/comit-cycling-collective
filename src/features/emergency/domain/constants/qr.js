import { medicalFieldNames } from '@/features/emergency/domain/constants/fields'
export const QR_GROUPS = [
  {
    id: 'identificacion',
    title: 'identification',
    fields: [
      'name',
      'birthDate',
      'bloodType',
      'contact',
      'phone',
      'contact2',
      'phone2',
    ],
  },
  {
    id: 'info-medica',
    title: 'medical',
    fields: ['name', ...medicalFieldNames],
  },
]
// A conservative print guideline, including the four-module quiet zone.
export const QR_MIN_MODULE_MM = 0.4
export const QR_MARGIN_MODULES = 4
