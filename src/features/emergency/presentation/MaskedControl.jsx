import { IMaskInput, IMaskMixin } from 'react-imask'
import { stripDiacritics } from '@/shared/stripDiacritics'

const MaskedTextarea = IMaskMixin(({ inputRef, ...props }) => (
  <textarea
    {...props}
    ref={inputRef}
  />
))

export function MaskedControl({ field, controlled, inputProps, onChange }) {
  const isNumeric = field.type === 'tel' || field.type === 'number'
  const isMultiline = field.type === 'textarea'
  const Component = isMultiline ? MaskedTextarea : IMaskInput
  return (
    <Component
      {...inputProps}
      name={controlled.name}
      inputRef={controlled.ref}
      onBlur={controlled.onBlur}
      value={controlled.value}
      mask={isNumeric ? /^\d*$/ : /^[^\u0300-\u036f]*$/}
      prepare={stripDiacritics}
      type={
        isMultiline ? undefined : field.type === 'number' ? 'text' : field.type
      }
      inputMode={isNumeric ? 'numeric' : undefined}
      maxLength={field.maxLength}
      autoComplete="off"
      placeholder={field.expandable ? undefined : field.placeholder}
      rows={isMultiline ? 2 : undefined}
      autoFocus={field.expandable}
      onAccept={(value) => {
        if (value !== controlled.value) {
          controlled.onChange(value)
          onChange()
        }
      }}
    />
  )
}
