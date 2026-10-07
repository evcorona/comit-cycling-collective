import texts from '@/locales/es.json'
import { useEmergencyForm } from '@/features/emergency/presentation/useEmergencyForm'
import { EmergencyForm } from '@/features/emergency/presentation/EmergencyForm'
import { QrResult } from '@/features/emergency/presentation/QrResult'
import { PrivacyNotice } from '@/features/emergency/presentation/PrivacyNotice'
export function EmergencyPage() {
  const form = useEmergencyForm()
  return (
    <main>
      <section
        id="formulario"
        className="mx-auto max-w-5xl px-3 py-5 sm:px-8 sm:py-8"
      >
        <div className="mb-6">
          <h1 className="display text-2xl text-black sm:text-4xl">
            {texts.common.qrTitle}
          </h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            {texts.emergencyPage.description}
          </p>
        </div>
        <div className="grid items-start gap-4 lg:grid-cols-[1.35fr_1fr]">
          <div className="min-w-0 space-y-4">
            <EmergencyForm {...form} />
            <PrivacyNotice />
          </div>
          <div className="space-y-5">
            <QrResult result={form.result} />
          </div>
        </div>
      </section>
    </main>
  )
}
