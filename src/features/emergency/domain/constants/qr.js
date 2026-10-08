export const QR_REQUIRED_FIELDS = ['name', 'contact', 'phone']

export const QR_PRIORITY_GROUPS = [
  ['bloodType', 'birthDate'],
  ['conditions'],
  ['insurer'],
  ['contact2', 'phone2'],
  ['notes'],
]

export const QR_CONTENT_ROWS = [
  { label: 'name', fields: ['name'] },
  { label: 'contact', fields: ['contact', 'phone'] },
  { label: 'bloodType', fields: ['bloodType'] },
  { label: 'birthDate', fields: ['birthDate'] },
  { label: 'conditions', fields: ['conditions'] },
  { label: 'insurer', fields: ['insurer'] },
  { label: 'contact2', fields: ['contact2', 'phone2'] },
  { label: 'notes', fields: ['notes'] },
]
