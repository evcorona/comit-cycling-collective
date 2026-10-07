# Comit · QR de emergencia

Aplicacion en espanol para generar un QR de texto con datos de emergencia. React, Vite y Tailwind CSS. Nombre y primer contacto de emergencia con telefono obligatorios. Segundo contacto, fecha de nacimiento, tipo de sangre, alergias, condiciones medicas, medicamentos y notas opcionales.

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

El directorio `dist` puede publicarse en cualquier alojamiento estatico. No requiere servidor de datos, credenciales ni variables de entorno.

## Privacidad

Los datos permanecen en el estado de React. No hay base de datos, cookies, almacenamiento local, analitica ni peticiones de red con informacion del formulario. Recargar, cerrar la pagina o pulsar Limpiar elimina el estado. El QR y el PNG descargado contienen los datos en texto; cualquiera que tenga la imagen puede leerlos. El boton de descarga genera una imagen de 1200 × 1200 pixeles localmente, sin servicios externos. Los limites de los campos mantienen el QR dentro de su capacidad; se recomienda incluir solo informacion breve y util.
