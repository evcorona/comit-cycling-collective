import texts from '@/locales/es.json'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { defaultValues } from '@/features/emergency/domain/constants/fields'
import { formSchema } from '@/features/emergency/domain/schema/emergencySchema'
import { createEmergencyQr } from '@/features/emergency/application/createEmergencyQr'
import { encodeQrImage } from '@/features/emergency/infrastructure/qrImage'
export function useEmergencyForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, resolver: zodResolver(formSchema) })
  const [format, setFormat] = useState('text')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [resetVersion, setResetVersion] = useState(0)
  async function generate(data) {
    setError('')
    try {
      const qr = await createEmergencyQr(data, encodeQrImage, format)
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
  function changeFormat(value) {
    setFormat(value)
    invalidate()
  }
  function invalidate() {
    setResult(null)
    setError('')
  }
  return {
    register,
    control,
    format,
    changeFormat,
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
