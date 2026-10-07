import { SecondaryContact } from '@/features/emergency/presentation/SecondaryContact'
import { ExpandableField } from '@/features/emergency/presentation/ExpandableField'
import texts from '@/locales/es.json'
import { QrCode, RotateCcw } from 'lucide-react'
import {
  emergencyFields,
  medicalFieldNames,
} from '@/features/emergency/domain/constants/fields'
import { EmergencyField } from '@/features/emergency/presentation/EmergencyField'
const groups = [
  { title: 'personal', names: ['name', 'birthDate', 'bloodType', 'notes'] },
  { title: 'contact', names: ['contact', 'phone'] },
  {
    title: 'medical',
    names: medicalFieldNames,
  },
]
export function EmergencyForm({
  register,
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
      className="min-w-0 rounded-2xl border border-black/10 bg-white p-4 sm:p-6"
    >
      <p className="mb-5 text-xs text-muted">
        {texts.emergencyForm.requiredHint}
      </p>
      <div className="space-y-6">
        {groups.map((group) => (
          <fieldset
            disabled={isSubmitting}
            key={group.title}
          >
            <legend className="mb-3 text-base font-bold">
              {texts.sections[group.title]}
            </legend>
            {group.title === 'medical' && (
              <p className="mb-3 text-xs leading-5 text-muted">
                {texts.emergencyForm.medicalHint}
              </p>
            )}
            <div className="grid min-w-0 gap-x-4 gap-y-4 sm:grid-cols-2">
              {group.names.map((name) => {
                const field = emergencyFields.find((item) => item.name === name)
                const Component = field.expandable
                  ? ExpandableField
                  : EmergencyField
                return (
                  <Component
                    key={`${name}-${field.expandable ? resetVersion : 0}`}
                    field={field}
                    register={register}
                    control={control}
                    error={errors[name]}
                    onChange={invalidate}
                  />
                )
              })}
            </div>
            {group.title === 'contact' && (
              <div className="mt-3">
                <SecondaryContact key={resetVersion}>
                  {['contact2', 'phone2'].map((name) => (
                    <EmergencyField
                      key={name}
                      field={emergencyFields.find(
                        (field) => field.name === name,
                      )}
                      register={register}
                      control={control}
                      error={errors[name]}
                      onChange={invalidate}
                    />
                  ))}
                </SecondaryContact>
              </div>
            )}
          </fieldset>
        ))}
      </div>
      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-pink"
        >
          {error}
        </p>
      )}
      <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="primary flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold"
        >
          <QrCode size={18} />
          {isSubmitting
            ? texts.emergencyForm.generating
            : texts.emergencyForm.generate}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={clear}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black/15 px-3 text-sm font-semibold"
        >
          <RotateCcw size={16} />
          {texts.emergencyForm.clear}
        </button>
      </div>
    </form>
  )
}
