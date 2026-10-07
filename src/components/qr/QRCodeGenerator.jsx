import { QRCodeSVG } from 'qrcode.react'
import clsx from 'clsx'
import texts from '@/locales/es.json'
import {
  QR_DEFAULT_LEVEL,
  QR_LIMITS,
  QR_RENDER_OPTIONS,
  QR_PREVIEW_SIZE,
} from '@/lib/qr/constants'
import { useQrMatrix } from '@/components/qr/useQrMatrix'
import { getQrContentStatus } from '@/lib/qr/getQrContentStatus'
import { getQrPrintAnalysis } from '@/lib/qr/getQrPrintAnalysis'
import { QRDiagnostics } from '@/components/qr/QRDiagnostics'

/**
 * @param {{value: string, physicalSizeCm: 1|2|3|4|5|6, errorCorrection?: 'L'|'M'|'Q'|'H', showDiagnostics?: boolean, showPrintStatus?: boolean, title?: string}} props
 */
export function QRCodeGenerator({
  value,
  physicalSizeCm,
  errorCorrection = QR_DEFAULT_LEVEL,
  showDiagnostics = false,
  showPrintStatus = true,
  title = texts.qrResult.regionLabel,
}) {
  const { svgRef, model, canEncode } = useQrMatrix(value, errorCorrection)
  if (!QR_LIMITS[physicalSizeCm])
    return <p role="alert">{texts.qrDiagnostics.invalidSize}</p>
  const analysis = model
    ? getQrPrintAnalysis(value, physicalSizeCm, model.totalModules)
    : {
        status: getQrContentStatus(value, physicalSizeCm),
        canPrint: false,
        recommendedCm: null,
      }
  const message = !canEncode
    ? texts.qrDiagnostics.generationError
    : !model
      ? texts.qrDiagnostics.validating
      : analysis.recommendedCm === null
        ? texts.qrDiagnostics.unsupported
        : analysis.canPrint && analysis.status === 'over-limit'
          ? texts.qrDiagnostics.matrixFits
          : analysis.isTooSmall || analysis.exceedsVersion
            ? texts.qrDiagnostics.tooDense.replace(
                '{size}',
                analysis.recommendedCm ?? analysis.minimumCm,
              )
            : texts.qrDiagnostics.messages[analysis.status].replace(
                '{size}',
                physicalSizeCm,
              )
  return (
    <div className="min-w-0">
      {canEncode && (
        <div
          className="qr-screen my-3 flex justify-center"
          style={{ '--qr-preview-size': `${QR_PREVIEW_SIZE}px` }}
        >
          <div
            className="qr-print"
            data-printable={analysis.canPrint}
            style={{
              width: `${physicalSizeCm}cm`,
              height: `${physicalSizeCm}cm`,
            }}
          >
            <QRCodeSVG
              ref={svgRef}
              {...QR_RENDER_OPTIONS}
              value={value}
              level={errorCorrection}
              size={QR_PREVIEW_SIZE}
              role="img"
              aria-label={texts.qrResult.imageAlt.replace('{title}', title)}
            />
          </div>
        </div>
      )}
      <p className="qr-status text-center text-sm font-semibold">{title}</p>
      {showPrintStatus && (
        <p
          role="status"
          className={clsx(
            'qr-status mt-2 text-xs leading-5',
            analysis.canPrint && analysis.status === 'optimal'
              ? 'text-muted'
              : 'text-pink',
          )}
        >
          {message}
        </p>
      )}
      {showPrintStatus && analysis.recommendedCm && (
        <p className="qr-status mt-1 text-xs text-muted">
          {texts.export.recommended.replace('{size}', analysis.recommendedCm)}
        </p>
      )}
      {showDiagnostics && (
        <QRDiagnostics
          value={value}
          physicalSizeCm={physicalSizeCm}
          errorCorrection={errorCorrection}
          model={model}
          analysis={analysis}
        />
      )}
    </div>
  )
}
