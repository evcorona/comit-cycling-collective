import clsx from 'clsx'
import texts from '@/locales/es.json'
import { Controller } from 'react-hook-form'
import { IMaskInput } from 'react-imask'
import { bloodTypes } from '@/features/emergency/domain/constants/fields'
import { localToday } from '@/shared/date'
export function EmergencyField({ field, register, control, error, onChange }) {
  const {
    name: key,
    label,
    placeholder,
    required,
    type,
    fullWidth,
    maxLength,
  } = field
  const common = {
    id: key,
    ...(type === 'tel' || type === 'number' ? {} : register(key, { onChange })),
    required,
    'aria-invalid': !!error,
    'aria-describedby':
      [field.expandable && `${key}-hint`, error && `${key}-error`]
        .filter(Boolean)
        .join(' ') || undefined,
  }
  return (
    <div
      key={key}
      className={clsx({ 'sm:col-span-2': fullWidth })}
    >
      <label
        htmlFor={key}
        className="mb-2 flex items-center justify-between text-xs font-semibold text-black"
      >
        <span>
          {label}
          {required && (
            <span className="ml-1">{texts.common.requiredMarker}</span>
          )}
        </span>
        {!required && (
          <span className="text-[10px] font-normal text-muted">
            {texts.common.optional}
          </span>
        )}
      </label>
      {field.expandable && (
        <p
          id={`${key}-hint`}
          className="mb-2 text-xs text-muted"
        >
          {placeholder}
        </p>
      )}
      {type === 'tel' || type === 'number' ? (
        <Controller
          name={key}
          control={control}
          render={({ field: controlled }) => (
            <IMaskInput
              {...common}
              name={controlled.name}
              inputRef={controlled.ref}
              onBlur={controlled.onBlur}
              value={controlled.value}
              mask={/^\d*$/}
              type={type === 'tel' ? 'tel' : 'text'}
              inputMode="numeric"
              maxLength={maxLength}
              autoComplete="off"
              placeholder={placeholder}
              onAccept={(value) => {
                if (value !== controlled.value) {
                  controlled.onChange(value)
                  onChange()
                }
              }}
            />
          )}
        />
      ) : type === 'select' ? (
        <select {...common}>
          <option value="">{texts.common.select}</option>
          {bloodTypes.map((value) => (
            <option
              key={value}
              value={value}
            >
              {value}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          {...common}
          maxLength={maxLength}
          rows={2}
          autoFocus={field.expandable}
          placeholder={field.expandable ? undefined : placeholder}
        />
      ) : (
        <input
          {...common}
          type={type}
          max={type === 'date' ? localToday() : undefined}
          maxLength={maxLength}
          autoComplete="off"
          placeholder={placeholder}
        />
      )}
      {error && (
        <p
          id={`${key}-error`}
          role="alert"
          className="mt-1.5 text-xs text-pink"
        >
          {error.message}
        </p>
      )}
    </div>
  )
}
