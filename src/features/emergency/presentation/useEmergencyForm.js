import texts from '@/locales/es.json'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { defaultValues } from '@/features/emergency/domain/constants/fields'
import { formSchema } from '@/features/emergency/domain/schema/emergencySchema'
import { createEmergencyQr } from '@/features/emergency/application/createEmergencyQr'
import { createPrintableQr } from '@/features/emergency/infrastructure/createPrintableQr'
export function useEmergencyForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, resolver: zodResolver(formSchema) })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [resetVersion, setResetVersion] = useState(0)
  async function generate(data) {
    setError('')
    try {
      const qr = await createEmergencyQr(data, createPrintableQr)
      setResult(qr)
    } catch {
      setError(texts.qr.generationError)
    }
  }
  function clear() {
    reset(defaultValues)
    setResetVersion((value) => value + 1)
    setResult(null)
    setError('')

    setFocus('name')
  }
  function invalidate() {
    setResult(null)
    setError('')
  }
  return {
    register,
    control,
    setValue,
    errors,
    isSubmitting,
    result,
    error,
    resetVersion,
    submit: handleSubmit(generate),
    clear,
    invalidate,
  }
}
