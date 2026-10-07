# Comit · QR de emergencia

Aplicacion en espanol para generar un QR de texto con datos de emergencia.
React, Vite y Tailwind CSS. Nombre y primer contacto de emergencia con telefono
obligatorios. Segundo contacto, fecha de nacimiento, tipo de sangre, alergias,
condiciones medicas, medicamentos y notas opcionales.

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

## Exportacion para impresion

El boton de descarga permite ajustar el lado del QR de 1 a 5 cm con un
deslizador, o elegir un tamaño personalizado de 1 a 30 cm. El PNG se genera
directamente del texto QR, a 300 ppp y con metadatos PNG pHYs. El tamano en
pixeles se calcula como `redondear(cm / 2.54 * 300)`. Para conservar la medida
fisica, imprimir al 100% de escala, sin ajustar a pagina. Comprueba siempre la
lectura del QR ya impreso, especialmente si hay muchos datos en una imagen
pequena.

## Tarjeta de emergencia

La sección de resultados ofrece una tarjeta PNG de 8.56 × 5.4 cm, equivalente a
una tarjeta de crédito, a 300 ppp. Incluye el logo de Comit, nombre, tipo de
sangre y contacto principal en texto. El QR conserva todos los datos completos,
incluidos contactos adicionales, datos médicos y notas. El texto impreso ajusta
su tamaño y se distribuye sin recortes. Se genera localmente con Canvas, sin
almacenar ni enviar información. Las etiquetas impresas conservan los acentos;
el QR permanece sin acentos. Imprimir al 100% de escala, sin ajustar a página.

## Teléfonos y formato del QR

Los teléfonos se capturan con máscara `00-0000-0000`. React Hook Form conserva
solo los 10 dígitos, y Zod rechaza números incompletos. Los guiones no se
incluyen en el contenido del QR.

El QR utiliza únicamente texto directo, sin enlaces ni formatos de contacto.
Así, la información médica y los contactos se leen juntos en los lectores QR
compatibles con texto, sin conexión y sin guardar contactos. No se garantiza que
cada lector convierta los teléfonos en enlaces de llamada. Las descargas de QR y
tarjeta contienen la misma información.
