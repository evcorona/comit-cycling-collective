import { PHONE_DIGITS } from '@/features/emergency/domain/constants/phone'
import { stripDiacritics } from '@/shared/stripDiacritics'
import texts from '@/locales/es.json'
export const emergencyFields = [
  {
    name: 'name',
    lettersOnly: true,
    label: texts.fields.name.label,
    placeholder: texts.fields.name.placeholder,
    required: true,
    type: 'text',
    fullWidth: true,
    maxLength: 100,
  },
  {
    name: 'birthDate',
    label: texts.fields.birthDate.label,
    placeholder: texts.fields.birthDate.placeholder,
    required: false,
    type: 'date',
    fullWidth: false,
    maxLength: 100,
  },
  {
    name: 'bloodType',
    label: texts.fields.bloodType.label,
    placeholder: texts.fields.bloodType.placeholder,
    required: false,
    type: 'select',
    fullWidth: false,
    maxLength: 100,
  },
  {
    name: 'contact',
    lettersOnly: true,
    label: texts.fields.contact.label,
    placeholder: texts.fields.contact.placeholder,
    required: true,
    type: 'text',
    fullWidth: false,
    maxLength: 100,
  },
  {
    name: 'phone',
    label: texts.fields.phone.label,
    placeholder: texts.fields.phone.placeholder,
    required: true,
    type: 'tel',
    fullWidth: false,
    maxLength: PHONE_DIGITS,
  },
  {
    name: 'contact2',
    lettersOnly: true,
    label: texts.fields.contact2.label,
    placeholder: texts.fields.contact2.placeholder,
    required: false,
    type: 'text',
    fullWidth: false,
    maxLength: 100,
  },
  {
    name: 'phone2',
    label: texts.fields.phone2.label,
    placeholder: texts.fields.phone2.placeholder,
    required: false,
    type: 'tel',
    fullWidth: false,
    maxLength: PHONE_DIGITS,
  },

  {
    name: 'conditions',
    group: 'medical',
    expandable: true,
    label: texts.fields.conditions.label,
    placeholder: texts.fields.conditions.placeholder,
    required: false,
    type: 'textarea',
    fullWidth: true,
    maxLength: 100,
  },
  {
    name: 'insurer',
    label: texts.fields.insurer.label,
    placeholder: texts.fields.insurer.placeholder,
    required: false,
    type: 'text',
    fullWidth: true,
    maxLength: 30,
  },
  {
    name: 'insurancePlan',
    label: texts.fields.insurancePlan.label,
    placeholder: texts.fields.insurancePlan.placeholder,
    required: false,
    type: 'text',
    fullWidth: false,
    maxLength: 24,
  },
  {
    name: 'policy',
    label: texts.fields.policy.label,
    placeholder: texts.fields.policy.placeholder,
    required: false,
    type: 'text',
    fullWidth: false,
    maxLength: 24,
  },
  {
    name: 'notes',
    group: 'notes',
    expandable: true,
    label: texts.fields.notes.label,
    placeholder: texts.fields.notes.placeholder,
    required: false,
    type: 'textarea',
    fullWidth: true,
    maxLength: 80,
  },
]
export const defaultValues = Object.fromEntries(
  emergencyFields.map(({ name }) => [name, '']),
)
export const bloodTypes = texts.common.bloodTypes.map(stripDiacritics)

export const medicalFieldNames = emergencyFields
  .filter(({ group }) => group === 'medical')
  .map(({ name }) => name)
