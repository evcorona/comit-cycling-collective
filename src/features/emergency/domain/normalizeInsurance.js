import { isPublicHealthProvider } from '@/features/emergency/domain/constants/healthProviders'

export function normalizeInsurance(data) {
  return isPublicHealthProvider(data.insurer)
    ? { ...data, insurancePlan: '', policy: '' }
    : { ...data, affiliation: '' }
}
