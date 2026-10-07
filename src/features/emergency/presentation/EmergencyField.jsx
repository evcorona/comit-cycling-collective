import clsx from 'clsx'
import texts from '@/locales/es.json'
import { Controller } from 'react-hook-form'
import { MaskedControl } from '@/features/emergency/presentation/MaskedControl'
import { bloodTypes } from '@/features/emergency/domain/constants/fields'
import { localToday } from '@/shared/date'
export function EmergencyField({ field, register, control, error, onChange }) {
  const { name: key, label, placeholder, required, type, fullWidth } = field
  const common = {
    id: key,
    ...(['select', 'date'].includes(type) ? register(key, { onChange }) : {}),
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
          {texts.fields[key].shortLabel || label}
          {required && (
            <span className="ml-1">{texts.common.requiredMarker}</span>
          )}
        </span>
      </label>
      {field.expandable && (
        <p
          id={`${key}-hint`}
          className="mb-2 text-xs text-muted"
        >
          {placeholder}
        </p>
      )}
      {!['select', 'date'].includes(type) ? (
        <Controller
          name={key}
          control={control}
          render={({ field: controlled }) => (
            <MaskedControl
              field={field}
              controlled={controlled}
              inputProps={common}
              onChange={onChange}
            />
          )}
        />
      ) : type === 'select' ? (
        <select {...common}>
          <option value="">{texts.common.select}</option>
          {bloodTypes.map((value, index) => (
            <option
              key={value}
              value={value}
            >
              {texts.common.bloodTypes[index]}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={type}
          max={type === 'date' ? localToday() : undefined}
          autoComplete="off"
          placeholder={placeholder}
        />
      )}
      {key === 'name' && (
        <p className="mt-1.5 text-xs text-muted">
          {texts.emergencyForm.inputHint}
        </p>
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
