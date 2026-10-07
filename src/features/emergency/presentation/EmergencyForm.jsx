import { MedicalField } from '@/features/emergency/presentation/MedicalField'
import texts from '@/locales/es.json'
import { UserRound, Info, QrCode, ArrowRight, RotateCcw } from 'lucide-react'
import { emergencyFields } from '@/features/emergency/domain/constants/fields'
import { EmergencyField } from '@/features/emergency/presentation/EmergencyField'
export function EmergencyForm({
  register,
  format,
  changeFormat,
  resetVersion,
  control,
  errors,
  isSubmitting,
  submit,
  clear,
  error,
  invalidate,
}) {
  return (
    <form
      noValidate
      onSubmit={submit}
      className="rounded-xl border border-stone-200 bg-white p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="rounded-lg bg-cream p-2.5 text-black">
          <UserRound size={20} />
        </span>
        <div>
          <h3 className="font-bold text-black">{texts.emergencyForm.title}</h3>
          <p className="mt-1 text-xs text-muted">
            {texts.emergencyForm.requiredHint}
          </p>
        </div>
      </div>
      <p className="mb-4 text-xs leading-5 text-muted">
        {texts.emergencyForm.inputHint}
      </p>
      <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {emergencyFields.map((field) => {
          const Component = field.expandable ? MedicalField : EmergencyField
          return (
            <Component
              key={`${field.name}-${field.expandable ? resetVersion : 0}`}
              field={field}
              register={register}
              control={control}
              error={errors[field.name]}
              onChange={invalidate}
            />
          )
        })}
      </div>
      <div className="mt-6 flex gap-2.5 rounded-lg bg-cream p-3 text-xs leading-5 text-muted">
        <Info
          size={16}
          className="mt-0.5 shrink-0 text-black"
        />
        <p>{texts.emergencyForm.medicalHint}</p>
      </div>
      <div className="mt-5">
        <label
          htmlFor="qr-format"
          className="mb-2 block text-xs font-semibold"
        >
          {texts.qrFormat.label}
        </label>
        <select
          id="qr-format"
          value={format}
          onChange={(event) => changeFormat(event.target.value)}
        >
          <option value="text">{texts.qrFormat.text}</option>
          <option value="vcard">{texts.qrFormat.vcard}</option>
        </select>
        <p className="mt-2 text-xs leading-5 text-muted">
          {format === 'vcard'
            ? texts.qrFormat.vcardHint
            : texts.qrFormat.textHint}
        </p>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-pink"
        >
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          disabled={isSubmitting}
          className="primary flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-bold"
        >
          <QrCode size={18} />
          {isSubmitting
            ? texts.emergencyForm.generating
            : texts.emergencyForm.generate}
          <ArrowRight
            size={17}
            className="ml-auto"
          />
        </button>
        <button
          type="button"
          onClick={clear}
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 py-3 text-xs font-semibold text-muted hover:bg-cream"
        >
          <RotateCcw size={14} />
          {texts.emergencyForm.clear}
        </button>
      </div>
    </form>
  )
}
