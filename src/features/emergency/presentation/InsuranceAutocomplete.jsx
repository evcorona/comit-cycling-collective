import { useState, useEffect, useRef } from 'react'
import { useController } from 'react-hook-form'
import clsx from 'clsx'
import texts from '@/locales/es.json'
import { emergencyFields } from '@/features/emergency/domain/constants/fields'
import { filterHealthProviders } from '@/features/emergency/domain/constants/healthProviders'
import { MaskedControl } from '@/features/emergency/presentation/MaskedControl'

const definition = emergencyFields.find(({ name }) => name === 'insurer')
export function InsuranceAutocomplete({ control, error, onProviderChange }) {
  const { field } = useController({ name: 'insurer', control })
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const options = filterHealthProviders(field.value)
  const listRef = useRef(null)
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])
  function change(value) {
    field.onChange(value)
    onProviderChange(value)
    setActive(-1)
  }
  function select(option) {
    change(option.value)
    setIsOpen(false)
  }
  function onKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActive((index) => {
        if (!options.length) return -1
        if (index < 0) return delta > 0 ? 0 : options.length - 1
        return (index + delta + options.length) % options.length
      })
    } else if (event.key === 'Enter' && isOpen) {
      event.preventDefault()
      if (active >= 0 && options[active]) select(options[active])
      else setIsOpen(false)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      setActive(-1)
    } else if (event.key === 'Tab') setIsOpen(false)
  }
  return (
    <div className="relative min-w-0 sm:col-span-2">
      <label
        htmlFor="insurer"
        className="mb-2 block text-xs font-semibold"
      >
        {definition.label}
      </label>
      <MaskedControl
        field={definition}
        controlled={{
          ...field,
          onChange: change,
          onBlur: () => {
            field.onBlur()
            setIsOpen(false)
            setActive(-1)
          },
        }}
        inputProps={{
          id: 'insurer',
          role: 'combobox',
          'aria-autocomplete': 'list',
          'aria-expanded': isOpen,
          'aria-controls': 'insurer-options',
          'aria-activedescendant':
            isOpen && active >= 0 ? `insurer-option-${active}` : undefined,
          'aria-invalid': !!error,
          'aria-describedby': error
            ? 'insurer-hint insurer-error'
            : 'insurer-hint',
          autoFocus: true,
          onFocus: () => {
            setIsOpen(true)
            setActive(-1)
          },
          onKeyDown,
          onInput: () => setIsOpen(true),
        }}
        onChange={() => {}}
      />
      {isOpen && (
        <div
          ref={listRef}
          id="insurer-options"
          role="listbox"
          aria-label={texts.healthProviders.suggestions}
          className="absolute inset-x-0 top-[76px] z-20 max-h-64 overflow-y-auto rounded-xl border border-black/15 bg-white p-1 shadow-lg"
        >
          {options.length ? (
            options.map((option, index) => (
              <div
                key={option.value}
                id={`insurer-option-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(option)}
                className={clsx(
                  'cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-pink/5',
                  index === active && 'bg-pink/5',
                )}
              >
                <span className="block font-semibold">{option.label}</span>
                <span className="text-xs text-muted">
                  {texts.healthProviders.types[option.type]}
                </span>
              </div>
            ))
          ) : (
            <p className="p-3 text-sm text-muted">
              {texts.healthProviders.noMatches}
            </p>
          )}
        </div>
      )}
      <p
        id="insurer-hint"
        className="mt-1.5 text-xs text-muted"
      >
        {texts.healthProviders.freeEntry}
      </p>
      {error && (
        <p
          id="insurer-error"
          role="alert"
          className="mt-1.5 text-xs text-pink"
        >
          {error.message}
        </p>
      )}
    </div>
  )
}
