import { useEmergencyForm } from "./useEmergencyForm";
import { EmergencyForm } from "./EmergencyForm";
import { QrResult } from "./QrResult";
import { PrivacyNotice } from "./PrivacyNotice";
export function EmergencyPage() {
  const form = useEmergencyForm();
  return (
    <main>
      <section
        id="formulario"
        className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-9"
      >
        <div className="mb-6">
          <h1 className="display text-3xl text-black sm:text-4xl">
            Tu QR de emergencia
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Completa tus datos, genera tu QR y llevalo en cada rodada.
          </p>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
          <EmergencyForm {...form} />
          <div className="space-y-5">
            <QrResult
              result={form.result}
              download={form.download}
              downloaded={form.downloaded}
            />
            <PrivacyNotice />
          </div>
        </div>
      </section>
    </main>
  );
}
