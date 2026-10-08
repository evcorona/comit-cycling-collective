import { useState } from 'react'
import { useWatch } from 'react-hook-form'
import { Plus } from 'lucide-react'
import texts from '@/locales/es.json'
import { InsuranceAutocomplete } from '@/features/emergency/presentation/InsuranceAutocomplete'
import { EmergencyField } from '@/features/emergency/presentation/EmergencyField'
import { emergencyFields } from '@/features/emergency/domain/constants/fields'
import { isPublicHealthProvider } from '@/features/emergency/domain/constants/healthProviders'

export function InsuranceSection({
  control,
  register,
  setValue,
  errors,
  invalidate,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const insurer = useWatch({ control, name: 'insurer' })
  function providerChanged(value) {
    if (isPublicHealthProvider(value))
      for (const name of ['insurancePlan', 'policy'])
        setValue(name, '', { shouldValidate: true, shouldDirty: true })

    invalidate()
  }
  return isExpanded ? (
    <div
      id="insurance-fields"
      className="grid min-w-0 gap-4 rounded-lg border border-black/10 p-3 sm:grid-cols-2"
    >
      <InsuranceAutocomplete
        control={control}
        error={errors.insurer}
        onProviderChange={providerChanged}
      />
      {!isPublicHealthProvider(insurer) &&
        ['insurancePlan', 'policy'].map((name) => (
          <EmergencyField
            key={name}
            field={emergencyFields.find((field) => field.name === name)}
            control={control}
            register={register}
            error={errors[name]}
            onChange={invalidate}
          />
        ))}
    </div>
  ) : (
    <button
      type="button"
      aria-expanded={false}
      aria-controls="insurance-fields"
      onClick={() => setIsExpanded(true)}
      className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-dashed border-black/20 px-3 py-3 text-left text-sm font-semibold hover:border-pink hover:bg-pink/5"
    >
      <Plus
        size={15}
        className="text-pink"
      />
      {texts.emergencyForm.addInsurance}
    </button>
  )
}
