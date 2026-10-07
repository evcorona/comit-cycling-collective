import { stripDiacritics } from '@/shared/stripDiacritics'
import texts from '@/locales/es.json'
import { z } from 'zod'
import {
  emergencyFields,
  bloodTypes,
} from '@/features/emergency/domain/constants/fields'
import { localToday } from '@/shared/date'
export const formSchema = z.object(
  Object.fromEntries(
    emergencyFields.map(({ name, label, required, type, maxLength }) => {
      let rule = z.string().trim().max(maxLength, texts.validation.tooLong)
      if (required)
        rule = rule.min(
          1,
          texts.validation.required.replace('{field}', label.toLowerCase()),
        )
      if (type === 'tel' || type === 'number')
        rule = rule.regex(/^\d*$/, texts.validation.numeric)
      if (type === 'select')
        rule = rule.refine(
          (value) => value === '' || bloodTypes.includes(value),
          texts.validation.bloodType,
        )
      if (type === 'date')
        rule = rule.refine((value) => {
          if (!value) return true
          const date = new Date(`${value}T00:00:00Z`)
          return (
            /^\d{4}-\d{2}-\d{2}$/.test(value) &&
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value &&
            value <= localToday()
          )
        }, texts.validation.birthDate)
      if (type === 'text' || type === 'textarea')
        rule = rule.transform(stripDiacritics)
      return [name, rule]
    }),
  ),
)
