# Comit · QR de emergencia

Aplicacion en espanol para generar dos QR de texto y una tarjeta plegable con
datos de emergencia. React, Vite y Tailwind CSS. Nombre y primer contacto de
emergencia con telefono obligatorios. Segundo contacto, fecha de nacimiento,
tipo de sangre, alergias, condiciones medicas, medicamentos y notas opcionales.

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

Alergias, condiciones medicas y medicamentos se muestran al pulsar sus botones.
Las ayudas se presentan como subtitulos. Limpiar elimina los valores y vuelve a
cerrar estos campos.

## QR para el casco

Se generan dos QR de texto directo, sin enlaces ni almacenamiento:

- `Identificacion`: nombre, nacimiento, sangre y contactos.
- `Info medica`: nombre, alergias, condiciones, medicamentos y notas. Si no se
  proporcionan datos médicos, lo indica explícitamente, sin asumir que no hay
  alergias o enfermedades.

Cada contenido termina con su identificador, sin acentos. La imagen descargada
incluye la misma etiqueta debajo, fuera del QR y su margen blanco. Ambos son
necesarios para consultar todos los datos; el nombre se repite para
relacionarlos. Cada lector decide si convierte los teléfonos en enlaces de
llamada.

Los campos médicos tienen límites compartidos por la máscara y Zod: alergias y
condiciones, 100 caracteres cada uno; medicamentos, 120; notas, 80. Los
contadores muestran el espacio utilizado. Los límites no garantizan por sí solos
la lectura física: la densidad se calcula con el contenido completo de cada QR.

## Exportación para impresión

El deslizador permite elegir de 2 a 5 cm; el tamaño personalizado, de 2 a 30 cm.
El valor inicial es 3 cm o la recomendación mayor que requieran los datos. El
mínimo se calcula a partir de los módulos, incluido el margen blanco de cuatro
módulos por lado, con una guía conservadora de 0.4 mm por módulo. Se redondea a
píxeles enteros a 300 ppp. Los tamaños insuficientes se bloquean tanto en la
interfaz como en el exportador. La recomendación se redondea hacia arriba a
incrementos de 0.5 cm.

El PNG incluye metadatos pHYs de 300 ppp. El lado del área QR es
`redondear(cm / 2.54 * 300)` píxeles; la etiqueta añade 0.35 cm debajo. El QR se
centra sin interpolación ni pérdida de su margen blanco. Para conservar las
medidas, imprimir al 100%, sin ajustar a página. La densidad es una guía; hay
que comprobar la lectura impresa con distintos teléfonos y en la superficie del
casco antes de usarla.

## Tarjeta de emergencia plegable

Una sola imagen PNG de aproximadamente 8.56 × 10.8 cm, a 300 ppp, contiene ambas
caras sin QR. Cada mitad mide 8.56 × 5.4 cm (1011 × 638 píxeles). El reverso
está girado 180° para quedar orientado al plegar por la línea central. Imprimir
al tamaño original, recortar el borde y doblar antes de enmicar.

El frente muestra nombre, nacimiento, sangre y ambos contactos, cuando existen.
El reverso contiene nombre y todos los campos médicos proporcionados. Se ajustan
las líneas y la tipografía sin recortar datos; si el contenido no cabe con la
tipografía mínima, se solicita resumirlo. Ambas caras llevan el logo y
`Comit Cycling Collective`. Las etiquetas conservan los acentos. La vista previa
y la descarga comparten el mismo PNG, generado en memoria con Canvas.

## Teléfonos

Los teléfonos se capturan con máscara `00-0000-0000`. React Hook Form conserva
solo los 10 dígitos, y Zod rechaza números incompletos. Los guiones no se
incluyen en el contenido de los QR.
