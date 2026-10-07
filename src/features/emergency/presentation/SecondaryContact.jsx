import { useState } from 'react'
import { Plus } from 'lucide-react'
import texts from '@/locales/es.json'

export function SecondaryContact({ children }) {
  const [isExpanded, setIsExpanded] = useState(false)
  return isExpanded ? (
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  ) : (
    <button
      type="button"
      onClick={() => setIsExpanded(true)}
      className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-dashed border-black/20 px-3 py-3 text-left text-sm font-semibold"
    >
      <Plus
        size={16}
        className="text-pink"
      />
      {texts.emergencyForm.addContact}
    </button>
  )
}
