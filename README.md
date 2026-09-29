# Front-ServiceIA

Aplicación móvil multiplataforma para conectar clientes que necesitan resolver tareas del hogar con profesionales que ofrecen servicios. El proyecto está construido con React Native y Expo y contempla dos experiencias: solicitar un servicio como cliente y gestionar solicitudes como profesional.

## Contexto y objetivo

La aplicación organiza la contratación de servicios alrededor de una publicación. El cliente describe el problema, selecciona una categoría y urgencia, revisa los datos y publica la solicitud. Los profesionales pueden consultar publicaciones disponibles para sus categorías y enviar una oferta con precio, disponibilidad y un mensaje. La interfaz está localizada para Colombia y utiliza Valledupar como ubicación inicial.

## Módulos principales

- **Autenticación:** las pantallas de inicio de sesión y registro permiten acceder a la aplicación. `useAuth` mantiene la sesión en contexto, restaura el token al iniciar y guarda o elimina los datos de autenticación mediante AsyncStorage.
- **Navegación y modos:** `RootNavigator` separa el acceso público de las rutas autenticadas. La navegación del cliente usa un stack; la del profesional usa pestañas. `AppModeContext` mantiene el modo y los datos del perfil profesional durante la ejecución.
- **Experiencia del cliente:** inicio con categorías, creación guiada de solicitud, publicaciones propias y perfil. El formulario se comparte entre pasos mediante `RequestFormContext`.
- **Experiencia del profesional:** inicio, solicitudes y ofertas enviadas, trabajos, saldo y perfil. Desde solicitudes se puede preparar y enviar una oferta a una publicación.
- **Perfil profesional:** el onboarding consulta el perfil de usuario, solicita una descripción y especialidades y envía esos datos al servicio de registro profesional.
- **Servicios ofrecidos:** `ManageServicesScreen` y sus componentes permiten crear y editar servicios; las operaciones API de crear, actualizar, publicar y eliminar están separadas en `features/services`.
- **Interfaz compartida:** componentes reutilizables para botones, encabezados, categorías, tarjetas, formularios, indicadores y filas informativas. `theme` centraliza colores y espaciado; `data` contiene categorías y datos de demostración.

## Funcionamiento del cliente

1. En Inicio, el cliente escribe qué necesita o elige una categoría.
2. En el asistente completa descripción y categoría, confirma la ubicación, selecciona la urgencia, puede agregar fotos y revisa el resumen.
3. Al publicar, `createServiceRequest` envía descripción, categoría y urgencia a `POST /publicaciones`.
4. La pantalla siguiente presenta una estructuración del problema y preguntas orientativas. Al confirmar, vuelve a Inicio y limpia el formulario.
5. En **Mis publicaciones** consulta sus publicaciones y puede revisar el estado de sus solicitudes.

## Funcionamiento del profesional

1. Una cuenta autenticada completa el onboarding con una descripción profesional y una o más categorías de especialidad.
2. En **Solicitudes**, la app consulta publicaciones disponibles para las categorías del profesional y las postulaciones existentes.
3. El profesional indica precio, disponibilidad y mensaje. La app envía la oferta a `POST /postulaciones` asociando el identificador de la publicación y del profesional.
4. La pestaña **Ofertas enviadas** permite revisar las postulaciones obtenidas del servicio.
5. **Trabajos** y **Saldo** muestran actualmente información de demostración; no representan todavía un ciclo transaccional completo.

## Estructura del proyecto

```text
src/
	api/          Cliente HTTP y operaciones de publicaciones/ofertas
	components/   Componentes reutilizables de interfaz
	data/         Categorías y contenido de demostración
	features/     Servicios de autenticación, usuario y catálogo de servicios
	hook/         Estado compartido de autenticación, modo y formulario
	lib/          Contextos de modo de app y solicitud
	navigation/   Rutas raíz, cliente y profesional
	screens/      Pantallas de acceso, cliente, profesional y servicios
	theme/        Tokens visuales
	utils/        Formato y utilidades comunes
```

`App.js` configura proveedores globales de modo, autenticación y áreas seguras. `RootNavigator` decide si presenta acceso/registro o las rutas autenticadas.

## Integración con backend

El cliente HTTP utiliza `EXPO_PUBLIC_API_URL` como URL base y, si no se define, usa `/api`. La instancia Axios de `features/services/api.js` adjunta el token de acceso como `Authorization: Bearer ...` cuando existe. Entre las rutas utilizadas se encuentran:

- `POST /auth/login`, `POST /auth/register` y `POST /auth/refresh`.
- `GET /usuarios/me`, `PUT /usuarios/me` y `DELETE /usuarios/me`.
- `POST /publicaciones`, además de consultas de publicaciones propias y disponibles para profesionales.
- `POST /postulaciones` y consulta de postulaciones.
- Operaciones de catálogo de servicios para crear, actualizar, publicar y eliminar.

Las rutas exactas y los formatos de respuesta deben coincidir con el backend desplegado. En particular, `requestsService` usa `src/api/client.js`, mientras que los servicios de autenticación/usuario usan la instancia de `features/services/api.js`; ambas dependen de que la URL base y la configuración del servidor sean compatibles.

## Estado actual y alcance

La aplicación es una base funcional/prototipo con integraciones parciales. Antes de considerar completo el flujo de contratación, hay que tener en cuenta lo siguiente:

- El análisis presentado como asistente/IA se construye en la interfaz con categorías y preguntas de ejemplo; no se observa una llamada a un modelo de IA.
- La ubicación inicia en Valledupar y el mapa es un marcador visual; no se seleccionan coordenadas ni una dirección precisa. La pantalla profesional también indica que la ubicación no está especificada en las publicaciones actuales.
- Agregar fotos solo crea elementos visuales de muestra; no abre cámara o galería ni carga archivos.
- Trabajos y saldo usan constantes de `mockData`; la acción de retiro no está conectada.
- `ManageServicesScreen` carga un servicio de ejemplo y no aparece dentro de las pestañas actuales de `ProfessionalNavigator`.
- La confirmación del asistente limpia el formulario y regresa al Inicio. El comentario en pantalla señala que la búsqueda real de profesionales aún se implementaría.

Por lo tanto, las pantallas y algunos endpoints ya permiten probar partes del flujo, pero la app todavía no cubre por completo pagos, aceptación de ofertas, asignación de trabajos, geolocalización, carga de imágenes ni análisis automatizado.

## Tecnologías

- Expo SDK 57 y React Native 0.86.
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
