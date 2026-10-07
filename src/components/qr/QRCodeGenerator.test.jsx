import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { QRCodeGenerator } from '@/components/qr/QRCodeGenerator'

describe('reusable SVG generator', () => {
  it('separates print dimensions from the preview and hides diagnostics by default', () => {
    const html = renderToStaticMarkup(
      <QRCodeGenerator
        value="ABC123"
        physicalSizeCm={2}
      />,
    )
    expect(html).toContain('width:2cm;height:2cm')
    expect(html).toContain('<svg')
    expect(html).toContain('data-printable="false"')
    expect(html).not.toContain('Detalles de impresión')
  })
  it('shows UTF-8, configured limits and optimization advice when requested', () => {
    const html = renderToStaticMarkup(
      <QRCodeGenerator
        value="Verónica 😀"
        physicalSizeCm={3}
        showDiagnostics
        errorCorrection="H"
      />,
    )
    expect(html).toContain('Bytes UTF-8')
    expect(html).toContain('Byte / UTF-8')
    expect(html).toContain('Versión máxima recomendada')
    expect(html).toContain('Usa mayúsculas')
  })
  it('handles invalid sizes and unencodable text without crashing React', () => {
    expect(
      renderToStaticMarkup(
        <QRCodeGenerator
          value="ABC"
          physicalSizeCm={2.5}
        />,
      ),
    ).toContain('Elige un tamaño entero')
    expect(
      renderToStaticMarkup(
        <QRCodeGenerator
          value={'a'.repeat(10000)}
          physicalSizeCm={6}
          showDiagnostics
        />,
      ),
    ).toContain('No pudimos generar este QR')
  })
})
