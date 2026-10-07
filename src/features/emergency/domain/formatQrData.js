import texts from '@/locales/es.json'
import { QR_GROUPS } from '@/features/emergency/domain/constants/qr'
import { stripDiacritics } from '@/shared/stripDiacritics'

export function formatQrData(data) {
  return QR_GROUPS.map(({ id, title, fields }) => {
    const populated = fields.filter((name) => data[name]?.trim())
    const lines = populated.map((name) => {
      const value =
        name === 'phone' || name === 'phone2'
          ? data[name].replace(/\D/g, '')
          : data[name].trim()
      return `${texts.qr.fields[name]}: ${value}`
    })
    if (title === 'medical' && !populated.some((name) => name !== 'name'))
      lines.push(texts.qr.noMedicalData)
    return {
      id,
      title: stripDiacritics(texts.qr.titles[title]),
      text: stripDiacritics([...lines, texts.qr.titles[title]].join('\n')),
    }
  })
}
