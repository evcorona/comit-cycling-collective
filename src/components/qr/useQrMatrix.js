import { useEffect, useRef, useState } from 'react'
import { QR_MAX_CAPACITY } from '@/lib/qr/constants'
import { getUtf8ByteLength } from '@/lib/qr/getUtf8ByteLength'
import { getQrEncodingMode } from '@/lib/qr/getQrEncodingMode'
import { getQrMatrixMetrics } from '@/lib/qr/getQrMatrixMetrics'

export function useQrMatrix(value, errorCorrection) {
  const svgRef = useRef(null)
  const [measured, setMeasured] = useState(null)
  const canEncode =
    (getQrEncodingMode(value) === 'byte'
      ? getUtf8ByteLength(value)
      : Array.from(value).length) <=
    (QR_MAX_CAPACITY[getQrEncodingMode(value)][errorCorrection] ?? 0)
  useEffect(() => {
    if (svgRef.current)
      setMeasured({
        value,
        errorCorrection,
        ...getQrMatrixMetrics(svgRef.current.getAttribute('viewBox')),
      })
  }, [value, errorCorrection])
  const model =
    measured?.value === value && measured.errorCorrection === errorCorrection
      ? measured
      : null
  return { svgRef, model, canEncode }
}
