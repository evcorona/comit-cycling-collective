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
        className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-9"
      >
        <div className="mb-6">
          <h1 className="display text-3xl text-black sm:text-4xl">
            {texts.common.qrTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            {texts.emergencyPage.description}
          </p>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
          <EmergencyForm {...form} />
          <div className="space-y-5">
            <QrResult result={form.result} />
            <PrivacyNotice />
          </div>
        </div>
      </section>
    </main>
  )
}
