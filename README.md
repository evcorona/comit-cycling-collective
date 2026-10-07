# Commit · QR de emergencia

Aplicación en español para generar un QR de texto con datos de emergencia. React, Vite y Tailwind CSS. Nombre obligatorio; contacto, teléfono, alergias, condiciones médicas y medicamentos opcionales.

## Desarrollo

Requiere Node.js 22 o posterior y npm.

```sh
npm ci --cache /tmp/npm-cache
npm run dev
```

## Compilación

```sh
npm run build
npm run preview
```

El directorio `dist` puede publicarse en cualquier alojamiento estático. No requiere servidor de datos, credenciales ni variables de entorno.

## Privacidad

Los datos permanecen en el estado de React. No hay base de datos, cookies, almacenamiento local, analítica ni peticiones de red con información del formulario. Recargar, cerrar la página o pulsar Limpiar elimina el estado. El QR y el PNG descargado contienen los datos en texto; cualquiera que tenga la imagen puede leerlos. El botón de descarga genera una imagen de 1200 × 1200 píxeles localmente, sin servicios externos. Los límites de los campos mantienen el QR dentro de su capacidad; se recomienda incluir solo información breve y útil.
