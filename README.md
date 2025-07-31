# Mantenap Tablet (Electron)

Aplicación de escritorio para tabletas con Windows y en Android en navegador, creada con Electron y Vue 3. Permite registrar y visualizar instrumentos de emergencia e informes directamente desde el dispositivo.

## Funcionalidades

- Visualización de instrumentos geolocalizados en un mapa
- Registro de informes de inspección, mantención y prueba
- Visualización de detalles e imágenes
- Exportación de informes en PDF
- Actualización automática con WebSocket
- Adaptada para pantallas táctiles

## Instalación

1. Clona el repositorio:
   git clone https://github.com/DaniNaranja/mantenap-tablet.git
   cd mantenap-tablet
   

2. Instala las dependencias:
   npm install
   

3. Compila la app:
   npm run build (Windows)

   npx vite --host (Android + Navegador)
   

4. Ejecuta la app con Electron:
   npx electron 

5. Para empaquetar:
   npm run electron:build
  

## Observaciones

- La aplicación requiere conexión a la red local donde se encuentra alojada la API (`http://192.168.42.1:3003`).
- La obtención de ubicación mediante GPS depende del soporte de Windows y los permisos del sistema. En Windows presenta algunos problemas, pero obtiene la ubicación en Android.
