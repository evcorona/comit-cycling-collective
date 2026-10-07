import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { defaultValues } from '@/features/emergency/domain/constants/fields'
import { formSchema } from '@/features/emergency/domain/schema/emergencySchema'
import { createEmergencyQr } from '@/features/emergency/application/createEmergencyQr'
import { encodeQrImage } from '@/features/emergency/infrastructure/qrImage'
import { downloadImage } from '@/shared/downloadImage'
export function useEmergencyForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, resolver: zodResolver(formSchema) })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  async function generate(data) {
    setError('')
    try {
      const qr = await createEmergencyQr(data, encodeQrImage)
      setResult(qr)
      setDownloaded(false)
    } catch {
      setError(
        'No pudimos crear el QR. Reduce la cantidad de texto e intentalo de nuevo.',
      )
    }
  }
  function clear() {
    reset(defaultValues)
    setResult(null)
    setError('')
    setDownloaded(false)
    setFocus('name')
  }
  function download() {
    if (!result) return
    downloadImage(result.image, 'comit-qr-emergencia.png')
    setDownloaded(true)
  }
  function invalidate() {
    setResult(null)
    setError('')
    setDownloaded(false)
  }
  return {
    register,
    control,
    errors,
    isSubmitting,
    result,
    error,
    downloaded,
    submit: handleSubmit(generate),
    clear,
    download,
    invalidate,
  }
}
