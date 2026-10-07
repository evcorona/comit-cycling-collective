import { Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { bloodTypes } from "../domain/constants/fields";
import { localToday } from "../../../shared/date";
export function EmergencyField({ field, register, control, error, onChange }) {
  const {
    name: key,
    label,
    placeholder,
    required,
    type,
    fullWidth,
    maxLength,
  } = field;
  const common = {
    id: key,
    ...(type === "tel" || type === "number" ? {} : register(key, { onChange })),
    required,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${key}-error` : undefined,
  };
  return (
    <div key={key} className={fullWidth ? "sm:col-span-2" : ""}>
      <label
        htmlFor={key}
        className="mb-2 flex items-center justify-between text-xs font-semibold text-black"
      >
        <span>
          {label}
          {required && <span className="ml-1">*</span>}
        </span>
        {!required && (
          <span className="text-[10px] font-normal text-muted">Opcional</span>
        )}
      </label>
      {type === "tel" || type === "number" ? (
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
              type={type === "tel" ? "tel" : "text"}
              inputMode="numeric"
              maxLength={maxLength}
              autoComplete="off"
              placeholder={placeholder}
              onAccept={(value) => {
                if (value !== controlled.value) {
                  controlled.onChange(value);
                  onChange();
                }
              }}
            />
          )}
        />
      ) : type === "select" ? (
        <select {...common}>
          <option value="">Selecciona una opcion</option>
          {bloodTypes.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          {...common}
          maxLength={maxLength}
          rows={2}
          placeholder={placeholder}
        />
      ) : (
        <input
          {...common}
          type={type}
          max={type === "date" ? localToday() : undefined}
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
  );
}
