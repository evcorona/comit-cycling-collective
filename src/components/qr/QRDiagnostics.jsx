import texts from '@/locales/es.json'
import { QR_LIMITS } from '@/lib/qr/constants'
import { getQrContentMetrics } from '@/lib/qr/getQrContentMetrics'
import { getQrOptimizationSuggestions } from '@/lib/qr/getQrOptimizationSuggestions'

export function QRDiagnostics({
  value,
  physicalSizeCm,
  errorCorrection,
  model,
  analysis,
}) {
  const limit = QR_LIMITS[physicalSizeCm]
  const metrics = getQrContentMetrics(value, physicalSizeCm)
  const unit = texts.qrDiagnostics.units[metrics.unit]
  const rows = [
    [texts.qrDiagnostics.characters, metrics.characterCount],
    [texts.qrDiagnostics.bytes, metrics.byteLength],
    [
      texts.qrDiagnostics.physicalSize,
      `${physicalSizeCm} ${texts.export.unit}`,
    ],
    [
      texts.qrDiagnostics.recommendedLimit,
      `${metrics.recommendedLimit} ${unit}`,
    ],
    [texts.qrDiagnostics.maximumLimit, `${metrics.maximumLimit} ${unit}`],
    [texts.qrDiagnostics.encoding, texts.qrDiagnostics.modes[metrics.mode]],
    [texts.qrDiagnostics.correction, errorCorrection],
    [texts.qrDiagnostics.versionLimit, `V${limit.version}`],
    [texts.qrDiagnostics.matrixLimit, `${limit.modules} × ${limit.modules}`],
    ...(model
      ? [
          [texts.qrDiagnostics.actualVersion, `V${model.version}`],
          [
            texts.qrDiagnostics.actualMatrix,
            `${model.modules} × ${model.modules}`,
          ],
        ]
      : []),
    [
      texts.qrDiagnostics.status,
      texts.qrDiagnostics.statusNames[analysis.status],
    ],
  ]
  const suggestions = getQrOptimizationSuggestions(value)
  return (
    <details className="qr-diagnostics mt-3 border-t border-black/10 pt-2">
      <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold">
        {texts.qrDiagnostics.title}
      </summary>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-xs leading-5">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="min-w-0"
          >
            <dt className="text-muted">{label}</dt>
            <dd className="break-words font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs leading-5 text-muted">
        {texts.qrDiagnostics.reference}
      </p>
      {suggestions.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-5 text-muted">
          {suggestions.map((key) => (
            <li key={key}>{texts.qrDiagnostics.suggestions[key]}</li>
          ))}
        </ul>
      )}
    </details>
  )
}
