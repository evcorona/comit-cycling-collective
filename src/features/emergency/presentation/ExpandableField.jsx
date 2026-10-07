import { useState } from 'react'
import { Plus } from 'lucide-react'
import clsx from 'clsx'
import texts from '@/locales/es.json'
import { EmergencyField } from '@/features/emergency/presentation/EmergencyField'

export function ExpandableField({ field, ...props }) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div
      className={clsx('sm:col-span-2', {
        'rounded-lg border border-black/10 p-3': isExpanded,
      })}
    >
      {isExpanded ? (
        <EmergencyField
          field={field}
          {...props}
        />
      ) : (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={field.name}
          onClick={() => setIsExpanded(true)}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-black/20 min-h-11 px-3 py-3 text-left text-sm font-semibold hover:border-pink hover:bg-pink/5"
        >
          <Plus
            size={15}
            className="text-pink"
          />
          {texts.expandable[field.name]}
        </button>
      )}
    </div>
  )
}
