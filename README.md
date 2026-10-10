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
y el PDF descargado contienen los datos en texto; cualquiera que tenga la imagen
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

El QR utiliza vCard 3.0 para que los lectores compatibles reconozcan un contacto
con teléfonos de emergencia. Puede contener nombre, año de nacimiento, sangre,
contactos, información médica y aseguradora o institución. El campo Notas se
conserva únicamente en la tarjeta. Los valores son mayúsculas sin acentos y no
dependen de URLs, servicios externos ni almacenamiento. La sección «Datos
incluidos en tu QR» presenta una versión legible del contenido, sin las
propiedades técnicas de vCard.

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
En todos los tamaños se mantienen nombre y primer contacto con teléfono. Los
bloques adicionales se agregan completos en este orden: sangre y año de
nacimiento, información médica, aseguradora o institución, segundo contacto con
teléfono y notas. Solo se agregan cuando el contenido está dentro de la
recomendación del modo detectado y su matriz cabe. El nacimiento completo
permanece en la tarjeta; el QR utiliza únicamente el año. No se salta una
prioridad para incluir la siguiente. La vista previa y las descargas usan el
mismo contenido seleccionado. La tarjeta conserva todos los datos. Si los datos
básicos no cumplen la recomendación o no caben, se bloquea la descarga y se pide
resumir; no se recortan automáticamente. La página muestra siempre los datos
incluidos en el QR, sin detalles técnicos, junto con una explicación breve y la
recomendación de resumir o aumentar el tamaño cuando se omiten campos. Las
descargas se llaman PDF y SVG. El componente QR genérico conserva su API de 1 a
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

PDF y SVG exportan la misma etiqueta con logo `public/comit_words.png`, QR sin
leyenda y borde punteado redondeado. Los 3–6 cm elegidos corresponden al QR; el
logo y el borde amplían la imagen exportada. La capacidad vuelve a usar la
recomendación y matriz real del QR a su tamaño original, sin restar espacio por
el logo. Se reservan franjas simétricas para centrar el QR horizontal y
verticalmente dentro del borde. Los módulos se rasterizan en píxeles enteros con
el mismo margen blanco de lectura. La vista previa usa el mismo SVG que se
descarga. El logo queda incrustado en el SVG. El PDF individual contiene una
página carta y coloca la etiqueta a 1 cm de arriba y de la izquierda,
conservando las medidas al imprimir al 100 %. Toastify JS confirma la descarga
de QR o tarjeta.

La vista en pantalla es una previsualización adaptable de hasta 320 px para la
etiqueta. La clase `qr-print` mantiene el tamaño físico seleccionado con
unidades cm al imprimir y `break-inside: avoid`. Los diagnósticos y controles se
ocultan en impresión; un QR marcado como insuficiente tampoco se imprime.
Imprimir al 100%, sin ajustar a página, y comprobar físicamente la lectura con
distintos teléfonos en la superficie del casco. Las pruebas digitales no
sustituyen esa comprobación.

## Tarjeta de emergencia plegable

La pieza plegable de 8.56 × 10.8 cm contiene ambas caras sin QR y un borde
punteado exterior de corte, además de la línea central de doblez. Su descarga
PDF se coloca a 1 cm de arriba y de la izquierda en una página carta. Cada mitad
mide 8.56 × 5.4 cm (1011 × 638 píxeles). El reverso está girado 180° para quedar
orientado al plegar por la línea central. Imprimir al tamaño original, recortar
el borde y doblar antes de enmicar.

El frente muestra nombre, nacimiento, sangre y contactos. El reverso contiene
condiciones médicas, aseguradora, nivel o plan, póliza y notas. El seguro es
opcional; su nombre puede incluirse en el QR según su prioridad. El plan, la
póliza y el número de afiliación se conservan solo en la tarjeta. Sus límites
son 30 caracteres para aseguradora y 24 para plan y póliza; se aplica la máscara
ASCII y Zod. Los teléfonos se muestran como 55-1234-5678 en la tarjeta y solo
dígitos en el QR. Las caras usan fondo blanco y texto negro, con encabezado,
lema y pie en negrita. El logo grande ocupa una columna del frente; con nombres
largos pasa al encabezado para dejar todo el ancho a los datos. Los valores
mantienen un mínimo de 38 píxeles a 300 ppp (aproximadamente 9 puntos). Las
etiquetas también se ajustan en varias líneas cuando es necesario. Si el
contenido supera el espacio disponible, se solicita resumirlo en lugar de
reducir la legibilidad. Ambas caras llevan el logo y `Comit Cycling Collective`.
Las etiquetas conservan sus acentos. La vista previa muestra la pieza de cerca;
la descarga la coloca en una hoja carta, manteniendo sus medidas.

El botón «Descargar plantilla PDF» genera cuatro tarjetas en una sola hoja
carta, distribuidas en dos columnas y dos filas. Cada pieza conserva sus 8.56 ×
10.8 cm, las guías de corte y doblez, un margen superior e izquierdo de 1 cm y
una separación de 0.5 cm. La descarga individual sigue disponible. Imprimir al
100 %, sin ajustar a página.

## Plantilla carta de QR

El botón debajo de PDF/SVG crea un PDF de una sola página carta. Contiene 15
etiquetas: ocho QR de 3 cm, tres de 4 cm, dos de 5 cm y dos de 6 cm. Cada tamaño
usa su propio contenido seleccionado, logo y borde punteado. La distribución
comprueba límites de página y no superpone piezas. Si los datos básicos no
permiten los cuatro tamaños, se pide resumir antes de descargar. jsPDF se carga
solo al solicitar la plantilla. Imprimir carta al 100 %, sin ajustar.

Notas aparece al final del formulario, con ejemplos breves. La ayuda recomienda
resumir para encontrar lo importante y facilitar la lectura del QR; no promete
tiempos de atención ni lectura garantizada.

## Autocompletado del seguro

El bloque completo se abre con «Agregar seguro médico». El autocompletado local
permite selección con teclado o toque y entrada libre. Incluye un listado
inicial de marcas privadas e instituciones públicas (IMSS, ISSSTE, IMSS
Bienestar, Secretaría de Salud y servicios estatales, Pemex, Sedena y Semar).
Los nombres visibles están en `src/locales/es.json`; la clasificación y búsqueda
viven en `domain/constants/healthProviders.js`. No se envían búsquedas ni datos
a terceros.

Es una lista de sugerencias mantenida manualmente, no un padrón exhaustivo ni
una verificación de cobertura. Para revisar su vigencia, consultar CNSF
(https://www.cnsf.gob.mx/), CONDUSEF (https://www.condusef.gob.mx/), IMSS
(https://www.imss.gob.mx/), ISSSTE (https://www.gob.mx/issste) e IMSS Bienestar
(https://www.imssbienestar.gob.mx/). Las consultas oficiales desde el entorno de
esta implementación devolvieron bloqueo de acceso 403; no se afirma validación
actualizada de esas fuentes.

Al elegir una institución pública se ocultan plan y póliza y se limpian sus
valores. La misma regla se aplica en Zod y antes de generar los resultados para
evitar que la tarjeta muestre datos ocultos de un seguro anterior. Al volver a
una aseguradora privada o a una entrada libre, los campos reaparecen vacíos. Los
datos de plan, póliza y afiliación siguen apareciendo exclusivamente en la
tarjeta.

Las instituciones públicas muestran un número de afiliación opcional: para IMSS
se etiqueta «Número de seguro social» y para las demás «Número de afiliación».
Admite texto ASCII libre en mayúsculas, hasta 32 caracteres, sin exigir 11
dígitos. El número aparece solo en la tarjeta y se borra al cambiar de
institución o volver a una aseguradora privada. El QR y la tarjeta descargados
en PDF conservan sus medidas dentro de una hoja carta, a 1 cm de arriba y de la
izquierda.

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

Las descargas individuales de QR y tarjeta son PDF de una página carta;
conservan las medidas de cada pieza y su ubicación a 1 cm de arriba y de la
izquierda. Los PNG se usan internamente para la vista previa y para incrustar
las piezas en el PDF. El SVG del QR y la plantilla PDF múltiple siguen
disponibles.

## QR vCard

PDF, SVG, vista previa y plantilla utilizan el mismo contenido vCard 3.0 y la
selección correspondiente al tamaño. El botón temporal fue retirado tras la
validación del usuario en iPhone. Los teléfonos usan propiedades TEL y etiquetas
de emergencia para iOS; los nombres de contactos y datos médicos se incluyen en
NOTE para lectores de contactos. El campo Notas del formulario no se incluye. El
plan, póliza y afiliación siguen fuera del QR.

El archivo utiliza CRLF, escapes y líneas plegadas a 75 caracteres ASCII. La
capacidad se calcula sobre ese contenido completo, no sobre la vista legible.
Las pruebas digitales comprueban generación y lectura del código. La
presentación de campos depende del lector del teléfono. No se requiere conexión
para leer el contenido ni se guarda información.
