# Comit · QR de emergencia

Aplicacion en espanol para generar un QR de texto y una tarjeta plegable con
datos de emergencia. React, Vite y Tailwind CSS. Nombre y primer contacto de
emergencia con telefono obligatorios. Segundo contacto, fecha de nacimiento,
tipo de sangre y condiciones medicas opcionales. El campo de condiciones permite
incluir alergias, enfermedades y medicamentos.

## Desarrollo

Requiere Node.js 22 o posterior y pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Compilacion

```sh
pnpm build
pnpm preview
```

El directorio `dist` puede publicarse en cualquier alojamiento estatico. No
requiere servidor de datos, credenciales ni variables de entorno.

## Privacidad

Los datos permanecen en el estado de React. No hay base de datos, cookies,
almacenamiento local, analitica ni peticiones de red con informacion del
formulario. Recargar, cerrar la pagina o pulsar Limpiar elimina el estado. El QR
y el PNG descargado contienen los datos en texto; cualquiera que tenga la imagen
puede leerlos. El boton de descarga genera una imagen localmente, sin servicios
externos. Los limites de los campos mantienen el QR dentro de su capacidad; se
recomienda incluir solo informacion breve y util.

## Estructura del codigo

- `src/main.jsx`: arranque de React; `App.jsx`: composicion de la pagina.
- `src/components`: cabecera y pie de pagina.
- `src/features/emergency/domain/constants`: campos, limites, valores iniciales
  y tipos de sangre compartidos.
- `src/features/emergency/domain/schema`: validacion con Zod.
- `src/features/emergency/domain`: formato del texto de emergencia, sin React ni
  APIs del navegador.
- `src/features/emergency/application`: creacion del resultado QR mediante un
  codificador inyectado.
- `src/features/emergency/infrastructure`: adaptador de la biblioteca QR.
- `src/features/emergency/presentation`: componentes y hook de React Hook Form.
- `src/shared`: fechas y descarga de imagenes.

La interfaz, el esquema y el texto del QR utilizan la misma definicion de
campos. El caso de uso recibe el codificador como dependencia, y el hook conecta
los adaptadores con los componentes. No se almacena informacion del formulario.

## Formato y lint

- `pnpm format`: aplica Prettier con la configuracion del proyecto.
- `pnpm format:check`: comprueba el formato sin modificar archivos.
- `pnpm lint`: ejecuta ESLint.
- `pnpm lint:fix`: aplica las correcciones automaticas de ESLint.

Prettier controla el formato. `eslint-config-prettier` desactiva las reglas que
pueden entrar en conflicto y `prettier/prettier` permanece desactivada. Los
imports internos usan `@/`, alias de `src` configurado en Vite y
`jsconfig.json`. Las reglas de TypeScript solicitadas estan registradas; la
aplicacion sigue en JavaScript y JSX.

## Textos y campos opcionales

Todos los textos de interfaz, validaciones, etiquetas, ayudas y metadatos del
HTML se agrupan en `src/locales/es.json`, por seccion y con claves estables.
Vite tambien utiliza este catalogo para el titulo y la descripcion del
documento. Las clases condicionales de Tailwind se componen con `clsx` y nombres
completos para que el compilador pueda detectarlas.

El campo de condiciones medicas se muestra al pulsar su boton y permite incluir
alergias, enfermedades y medicamentos. Las ayudas se presentan como subtitulos.
Limpiar elimina los valores y vuelve a cerrar estos campos.

## QR de emergencia

Un solo QR contiene nombre, nacimiento, sangre, contactos, condiciones médicas y
notas. El texto termina con `EMERGENCIA`, está en mayúsculas y no depende de
URLs, servicios externos ni almacenamiento. Las etiquetas son breves (`NOMBRE`,
`NACIMIENTO`, `SANGRE`, `CONTACTO-1`, `CONTACTO-2`, `INFO-MEDICA`, `NOTAS`).
Cada contacto reúne nombre y teléfono en una línea, separados por un espacio. La
revisión muestra exactamente el texto que se codifica. Si no hay información
médica, se indica explícitamente.

El campo de condiciones médicas permite incluir alergias, enfermedades y
medicamentos y tiene un límite de 100 caracteres. Notas tiene 80 caracteres.
Ambos límites y los contadores usan la definición compartida con Zod. La máscara
normaliza acentos y mayúsculas, cambia flechas y viñetas por espacios, cambia la
raya larga por un guion y descarta emojis y caracteres fuera del ASCII
imprimible. Zod rechaza texto que omita esas restricciones. Los saltos de línea
se conservan para facilitar la lectura y requieren modo Byte / UTF-8.

## Componente QR reutilizable

`src/components/qr/QRCodeGenerator.jsx` acepta `value`, `physicalSizeCm` (entero
1–6), `errorCorrection` (`L`, `M`, `Q`, `H`, por defecto `M`), `showDiagnostics`
(por defecto `false`) y un `title` opcional. Usa `QRCodeSVG` de `qrcode.react`
sin logos ni gradientes, negro sobre blanco y quiet zone de cuatro módulos.
`boostLevel={false}` respeta el nivel solicitado en vez de incrementarlo
automáticamente.

`QRDiagnostics.jsx` agrupa en un desplegable los caracteres (puntos de código),
bytes UTF-8 con `TextEncoder`, modo numérico, alfanumérico o Byte, estado, nivel
de corrección, versión/matriz real y límites recomendados. Las sugerencias no
modifican los datos. Las utilidades independientes están en `src/lib/qr`. Los
límites M proporcionados son guías para Byte. Los presupuestos alfanuméricos y
numéricos se cuentan en caracteres, con capacidades M de las mismas versiones y
el mismo margen proporcional de recomendación. El peso UTF-8 se muestra por
separado. La biblioteca elige la versión y genera toda la matriz.

Ejemplo de uso:

```jsx
import { QRCodeGenerator } from '@/components/qr/QRCodeGenerator'

;<QRCodeGenerator
  value="VERONICA CORONA"
  physicalSizeCm={3}
  errorCorrection="M"
  showDiagnostics
/>
```

## Exportación e impresión

El deslizador de emergencia ofrece tamaños enteros de 3 a 6 cm y parte de 3 cm.
En todos los tamaños se mantienen los datos básicos y se agrega primero
información médica y después notas, completas, si el contenido está dentro de la
recomendación del modo detectado y su matriz cabe. No se salta una prioridad
para incluir la siguiente. La vista previa y las descargas usan el mismo
contenido seleccionado. La tarjeta conserva todos los datos. Si los datos
básicos no cumplen la recomendación o no caben, se bloquea la descarga y se pide
resumir; no se recortan automáticamente. La página muestra siempre los datos
incluidos en el QR, sin detalles técnicos, junto con una explicación breve y la
recomendación de resumir o aumentar el tamaño cuando se omiten campos. Las
descargas se llaman PNG y SVG. El componente QR genérico conserva su API de 1 a
6 cm y sus diagnósticos opcionales para otros usos. El contenido se clasifica
como `optimal`, `warning` u `over-limit` con los presupuestos del modo
detectado; el mínimo físico se comprueba además con la matriz real y una guía
conservadora de 0.4 mm por módulo, redondeada a píxeles enteros de 300 ppp. Los
tamaños insuficientes se bloquean en la interfaz y ambos exportadores por
versión y densidad reales. Un presupuesto M excedido no bloquea por sí solo una
matriz válida, por ejemplo al usar un nivel de corrección diferente. Por esa
guía, incluso un QR pequeño puede necesitar más de 1 cm aunque cumpla el
presupuesto de bytes. Por encima del rango soportado, se pide resumir el texto;
no se recorta automáticamente.

PNG y SVG exportan la misma etiqueta cuadrada de 3–6 cm, incluido el logo
`public/comit_words.png` centrado arriba, QR sin leyenda y borde punteado
redondeado para recortar. El tamaño mide toda la etiqueta. El cálculo de
capacidad conserva la guía por modo y comprueba además el espacio real del QR
tras reservar logo y márgenes. El margen exterior es de 0.05 cm; el logo y la
leyenda ocupan una franja compacta para priorizar el área del QR. Los módulos se
ajustan a píxeles enteros con la guía conservadora de 300 ppp; el logo queda
fuera de la zona de lectura. La vista previa usa el mismo SVG que se descarga y
rasteriza a PNG. El logo queda incrustado en el SVG para que funcione sin
archivos externos. El PNG mantiene metadatos pHYs a 300 ppp. Toastify JS muestra
una confirmación temporal al iniciar la descarga de QR o tarjeta, sin mensajes
fijos en la vista previa.

La vista en pantalla es una previsualización adaptable de hasta 320 px para la
etiqueta. La clase `qr-print` mantiene el tamaño físico seleccionado con
unidades cm al imprimir y `break-inside: avoid`. Los diagnósticos y controles se
ocultan en impresión; un QR marcado como insuficiente tampoco se imprime.
Imprimir al 100%, sin ajustar a página, y comprobar físicamente la lectura con
distintos teléfonos en la superficie del casco. Las pruebas digitales no
sustituyen esa comprobación.

## Tarjeta de emergencia plegable

Una sola imagen PNG de aproximadamente 8.56 × 10.8 cm, a 300 ppp, contiene ambas
caras sin QR. Cada mitad mide 8.56 × 5.4 cm (1011 × 638 píxeles). El reverso
está girado 180° para quedar orientado al plegar por la línea central. Imprimir
al tamaño original, recortar el borde y doblar antes de enmicar.

El frente muestra nombre, nacimiento, sangre y contactos. El reverso contiene
nombre, condiciones médicas y notas, incluidas alergias y medicamentos cuando se
proporcionan. Las líneas y tipografía se ajustan sin recortar datos; si el
contenido no cabe con la tipografía mínima, se solicita resumirlo. Ambas caras
llevan el logo y `Comit Cycling Collective`. Las etiquetas conservan sus
acentos. La vista previa y la descarga comparten el mismo PNG generado en
memoria.

## Verificación

`pnpm test` ejecuta Vitest con los ejemplos ASCII, acentos, minúsculas, números,
puntuación y emoji solicitados. Cubre UTF-8, detección de modo, límites de todos
los tamaños, recomendaciones, quiet zone para los cuatro niveles, densidad
física, máscaras, esquema, notas y la generación de un único QR completo.

## Teléfonos

Los teléfonos se capturan con máscara `00-0000-0000`. React Hook Form conserva
solo los 10 dígitos, y Zod rechaza números incompletos. Los guiones no se
incluyen en el contenido del QR. Cada lector decide si convierte los números en
enlaces para llamar.

## Archivos de esta implementación

- Creados: `src/components/qr/` (generador, diagnósticos, hook de medición y
  prueba), `src/lib/qr/` (constantes, UTF-8, modos, métricas, presupuestos,
  recomendaciones, matriz, SVG, unidades de impresión y pruebas),
  `src/features/emergency/domain/formatQrData.test.js`,
  `src/features/emergency/infrastructure/createPrintableQr.js` y
  `src/features/emergency/presentation/ExpandableField.jsx`.
- Actualizados: `package.json`, `pnpm-lock.yaml`, `vite.config.js`,
  `src/style.css`, `src/locales/es.json`,
  `src/features/emergency/application/createEmergencyQr.js`, los archivos de
  `src/features/emergency/domain/constants/`, `domain/formatQrData.js`,
  `domain/sanitizeEmergencyText.js`, `infrastructure/cardLayout.js`,
  `infrastructure/exportEmergencyCard.js`, `infrastructure/exportQr.js`,
  `presentation/EmergencyForm.jsx`, `presentation/EmergencyPage.jsx`,
  `presentation/QrDownload.jsx`, `presentation/QrResult.jsx`,
  `presentation/useEmergencyForm.js` y este README. Las rutas abreviadas de
  dominio, infraestructura y presentación están bajo `src/features/emergency/`.
- Reemplazados: `MedicalField.jsx` por `ExpandableField.jsx` y `qrImage.js` por
  `createPrintableQr.js`. Eliminado `domain/formatEmergencyData.js`: la revisión
  ahora usa directamente el único contenido QR, sin un segundo formateador.
