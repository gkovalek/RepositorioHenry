# MemoryClip

Gestor de tareas personal con autenticación, persistencia en la nube y notificaciones por email.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Routing | React Router v7 |
| Auth / DB | Firebase Auth + Cloud Firestore |
| Email | AWS SES via Vercel Functions |
| Estilos | Tailwind CSS v4 |
| Testing | Vitest v2 + React Testing Library |
| Deploy | Vercel |

## Instalación local

```bash
git clone <url-del-repo>
cd _CarpetaHenry_
npm install
cp .env.example .env   # completar con tus valores
npm run dev
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```
# Firebase — expuestos al browser (prefijo VITE_)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# AWS SES — solo en servidor (sin prefijo VITE_)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
SES_FROM_EMAIL=        # email verificado en SES
SES_TO_EMAIL=          # email destino (opcional; si está vacío usa el email del usuario)
```

> **Seguridad**: `.env` está en `.gitignore`. Las credenciales AWS nunca llegan al frontend.

## Comandos

```bash
npm run dev        # servidor de desarrollo
npm run build      # build de producción
npm run test:run   # tests (12 tests, 4 suites)
npm run lint       # linter
```

## Estructura del proyecto

```
src/
├─ pages/           # Login, Register, Tasks
├─ components/      # TodoForm, TodoList, TodoItem, Navbar
├─ features/auth/   # AuthContext, AuthProvider, useAuth
├─ services/        # firebase.ts, firestore.ts
├─ routes/          # AppRouter.tsx, ProtectedRoute.tsx
├─ hooks/           # useTasks.ts
├─ types/           # task.ts
└─ utils/           # errorMessages.ts
api/
└─ sendEmail.ts     # Vercel Function (AWS SES)
tests/
├─ unit/            # errorMessages, firestore
└─ components/      # TodoForm, TodoList
```

## Funcionalidades

- **Autenticación**: registro y login con email/password via Firebase Auth
- **Rutas protegidas**: `ProtectedRoute` redirige a `/login` si no hay sesión
- **CRUD de tareas**: crear, editar inline, marcar completada, eliminar
- **Tiempo real**: suscripción `onSnapshot` actualiza la lista sin recargar
- **Seguridad Firestore**: reglas que restringen cada usuario a sus propias tareas
- **Email**: botón "Enviar resumen" genera un texto con pendientes y completadas y lo envía via SES

## Flujo de envío de email

1. Usuario pulsa "Enviar resumen" en `/tasks`
2. Frontend hace `POST /api/sendEmail` con `{ summary, userEmail }`
3. Vercel Function (`api/sendEmail.ts`) instancia `SESClient` con las credenciales del entorno
4. SES envía el email desde `SES_FROM_EMAIL` hacia `SES_TO_EMAIL` (o el email del usuario)
5. Frontend muestra estado `sending → sent | error`

> En modo sandbox de AWS SES, tanto el remitente como el destinatario deben estar verificados.

## URL de producción

https://m4-gerardo-kovalek.vercel.app

> También accesible en: https://repositorio-henry-pi.vercel.app

## Tests

12 tests en 4 suites:

- `errorMessages.test.ts` — mapeo de códigos Firebase a mensajes en español
- `firestore.test.ts` — createTask, toggleComplete, deleteTask
- `TodoForm.test.tsx` — render, submit con valores, guard de título vacío
- `TodoList.test.tsx` — render lista, loading, empty state, error

```bash
npm run test:run
# Tests  12 passed (12)
```

## Decisiones arquitectónicas

- **Tailwind CSS v4** vía plugin `@tailwindcss/vite` (sin postcss)
- **Context API** para auth global (sin Redux/Zustand — scope del proyecto no lo justifica)
- **Subcollección Firestore** `users/{uid}/tasks/{id}` para aislamiento por usuario
- **`vi.hoisted()`** para mocks de Firestore (Vitest hoist `vi.mock` al tope del archivo)
- **happy-dom** como entorno de test (evita conflicto ESM de `@aws-sdk/client-ses` con jsdom)
- **Vercel Functions** en `/api` para mantener credenciales AWS exclusivamente server-side

## Uso de IA

Este proyecto (MemoryClip) fue desarrollado con asistencia de Claude (Anthropic) como copiloto. Las decisiones de arquitectura, estructura de carpetas, stack tecnológico y lógica de negocio fueron definidas en la consigna del proyecto. Claude asistió en:

- Implementación de los hitos según la especificación
- Resolución de errores de configuración (Rolldown en Windows, ESM/CJS en Vitest, `type User` de Firebase)
- Configuración de Firestore security rules via Firebase Console
- Escritura de tests con mocks de Firebase
