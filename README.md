# Front-ServiceIA

Aplicación móvil multiplataforma para conectar clientes que necesitan resolver tareas del hogar con profesionales que ofrecen servicios. El proyecto está construido con React Native y Expo y contempla dos experiencias: solicitar un servicio como cliente y gestionar solicitudes como profesional.

## Contexto y objetivo

La aplicación organiza la contratación de servicios alrededor de una publicación. El cliente describe el problema, selecciona una categoría y urgencia, revisa los datos y publica la solicitud. Los profesionales pueden consultar publicaciones disponibles para sus categorías y enviar una oferta con precio, disponibilidad y un mensaje. La interfaz está localizada para Colombia y utiliza Valledupar como ubicación inicial.

## Módulos principales

- **Autenticación:** las pantallas de inicio de sesión y registro permiten acceder a la aplicación. `useAuth` mantiene la sesión en contexto, restaura el token al iniciar y guarda o elimina los datos de autenticación mediante AsyncStorage.
- **Navegación y modos:** `RootNavigator` separa el acceso público de las rutas autenticadas. Tanto cliente como profesional combinan pestañas y un stack para sus flujos secundarios. `AppModeContext` mantiene el modo y los datos del perfil profesional durante la ejecución.
- **Experiencia del cliente:** inicio con categorías, creación guiada de solicitud, publicaciones propias, ofertas recibidas, chat y perfil. El borrador se comparte entre pasos mediante `RequestDraftContext`.
- **Experiencia del profesional:** inicio, solicitudes y ofertas enviadas, trabajos, saldo y perfil. Desde solicitudes se puede preparar y enviar una oferta a una publicación.
- **Perfil profesional:** el onboarding consulta el perfil de usuario, solicita una descripción y especialidades y envía esos datos al servicio de registro profesional.
- **Comunicación y reputación:** chat, notificaciones y reseñas verificadas acompañan el ciclo de contratación.
- **Catálogo:** las operaciones para crear, actualizar, publicar y eliminar servicios están separadas en `features/catalog`.
- **Interfaz compartida:** componentes reutilizables para botones, encabezados, categorías, tarjetas, formularios, indicadores y filas informativas. `theme` centraliza colores y espaciado; `data` contiene categorías y datos de demostración.

## Funcionamiento del cliente

1. En Inicio, el cliente escribe qué necesita o elige una categoría.
2. En el asistente completa descripción y categoría, confirma la ubicación, selecciona la urgencia, puede agregar fotos y revisa el resumen.
3. Al publicar, `createServiceRequest` envía descripción, categoría y urgencia a `POST /publicaciones`.
4. La pantalla de éxito permite volver al inicio o consultar la publicación creada y limpia el borrador.
5. En **Mis publicaciones** consulta sus solicitudes, revisa ofertas, acepta una propuesta y sigue el estado del servicio.

## Funcionamiento del profesional

1. Una cuenta autenticada completa el onboarding con una descripción profesional y una o más categorías de especialidad.
2. En **Solicitudes**, la app consulta publicaciones disponibles para las categorías del profesional y las postulaciones existentes.
3. El profesional indica precio, disponibilidad y mensaje. La app envía la oferta a `POST /postulaciones` asociando el identificador de la publicación y del profesional.
4. La pestaña **Ofertas enviadas** permite revisar las postulaciones obtenidas del servicio.
5. **Trabajos** consulta asignaciones reales y permite iniciar o completar el servicio. **Saldo** sigue siendo una vista demostrativa, sin operaciones financieras reales.

## Estructura del proyecto

```text
src/
	core/         Cliente HTTP, normalización de respuestas y almacenamiento
	features/     Módulos de producto, pantallas, API y componentes por dominio
	hook/         Contexto compartido de autenticación
	navigation/   Rutas raíz, cliente, profesional y autenticación
	shared/       Componentes, layouts y hooks reutilizables
	theme/        Tokens visuales
	utils/        Formato y utilidades comunes
```

`App.js` configura proveedores globales de modo, autenticación y áreas seguras. `RootNavigator` decide si presenta acceso/registro o las rutas autenticadas.

## Integración con backend

El cliente HTTP de `src/core/api/client.js` utiliza `EXPO_PUBLIC_API_URL` como URL base y, si no se define, usa `/api`. La instancia Axios adjunta el token de acceso como `Authorization: Bearer ...` cuando existe. Entre las rutas utilizadas se encuentran:

- `POST /auth/login`, `POST /auth/register` y `POST /auth/refresh`.
- `GET /usuarios/me`, `PUT /usuarios/me` y `DELETE /usuarios/me`.
- `POST /publicaciones`, además de consultas de publicaciones propias y disponibles para profesionales.
- `POST /postulaciones`, consulta de postulaciones y aceptación de ofertas.
- Consulta e inicio/finalización de trabajos.
- Conversaciones, mensajes, notificaciones y reseñas.
- Operaciones de catálogo de servicios para crear, actualizar, publicar y eliminar.

Las rutas exactas y los formatos de respuesta deben coincidir con el backend desplegado. Todas las funcionalidades consumen la instancia compartida ubicada en `src/core/api/client.js`.

## Estado actual y alcance

La aplicación es una base funcional/prototipo con integraciones parciales. Antes de considerar completo el flujo de contratación, hay que tener en cuenta lo siguiente:

- El análisis presentado como asistente/IA se construye en la interfaz con categorías y preguntas de ejemplo; no se observa una llamada a un modelo de IA.
- La ubicación inicia en Valledupar y el mapa es un marcador visual; no se seleccionan coordenadas ni una dirección precisa. La pantalla profesional también indica que la ubicación no está especificada en las publicaciones actuales.
- Agregar fotos solo crea elementos visuales de muestra; no abre cámara o galería ni carga archivos.
- La billetera usa datos simulados y la acción de retiro no está conectada. Su integración funcional está fuera del alcance actual del frontend.
- El chat usa la API disponible, pero todavía no dispone de transporte en tiempo real.
- El refresh token existe en la capa API, pero la renovación automática de sesión aún está pendiente.

Por lo tanto, el flujo principal ya permite publicar, ofertar, aceptar, ejecutar y reseñar servicios. La app todavía no cubre pagos, geolocalización precisa, carga real de imágenes ni análisis automatizado.

## Tecnologías

- Expo SDK 57.0.33 y React Native 0.86.3.
- React 19, React Navigation 7 y Expo Vector Icons.
- Axios para comunicación HTTP.
- AsyncStorage para persistencia local de autenticación.
- React Hook Form y Zod disponibles para formularios y validación.

## Ejecución local

Instala las dependencias con `npm install` y configura `EXPO_PUBLIC_API_URL` para apuntar al backend. Luego ejecuta:

```bash
npm start
```

También están disponibles `npm run android`, `npm run ios`, `npm run web` y `npm run build:web`.

## Calidad de código

Antes de entregar cambios ejecuta:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build:web
```

`npm run format` aplica Prettier a los archivos fuente y de configuración. Los archivos `.env*.local` son locales y no deben versionarse.
