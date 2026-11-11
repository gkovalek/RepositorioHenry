# MemoryClip — Gestor estratégico de tareas

Aplicación web SPA de gestión de tareas con autenticación, persistencia en la nube y notificaciones por email.

**URL de producción:** https://m4-gerardo-kovalek.vercel.app

---

## Stack tecnológico

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Auth & DB:** Firebase Authentication + Cloud Firestore
- **Email:** AWS SES invocado a través de Vercel Functions
- **Deploy:** Vercel
- **Testing:** Vitest + React Testing Library

---

## Funcionalidades

- Registro y login con email/password
- Rutas privadas protegidas (redirige a `/login` si no hay sesión)
- CRUD completo de tareas: crear, listar, editar, eliminar y marcar como completada
- Persistencia por usuario en Firestore (cada usuario solo ve sus propias tareas)
- Envío de resumen de tareas por email en formato HTML con diseño dark

---

## Estructura del proyecto

```
project-root/
├── api/
│   └── sendEmail.ts          # Vercel Function — envío de email con AWS SES
├── src/
│   ├── pages/                # Login, Register, Tasks
│   ├── components/           # Navbar, TodoForm, TodoList, TodoItem, ParticleField
│   ├── features/auth/        # AuthContext (proveedor de sesión)
│   ├── services/             # firebase.ts, firestore.ts (CRUD)
│   ├── routes/               # AppRouter, ProtectedRoute
│   ├── hooks/                # useTasks (suscripción en tiempo real a Firestore)
│   ├── types/                # Task interface
│   └── utils/                # errorMessages (traducción de errores de Firebase)
├── tests/
│   ├── __mocks__/            # Mock de Firebase para tests
│   ├── components/           # TodoForm.test, TodoList.test
│   └── unit/                 # errorMessages.test, firestore.test
├── .env.example              # Variables de entorno requeridas (sin valores)
└── README.md
```

---

## Decisiones arquitectónicas

- **Firestore subcollections:** las tareas se guardan en `users/{uid}/tasks` para garantizar aislamiento total por usuario sin necesidad de filtros adicionales.
- **Vercel Functions para SES:** los secretos de AWS nunca llegan al bundle del frontend; la función actúa como proxy seguro.
- **AuthContext:** un único proveedor de sesión que expone `user` y `signOut` a toda la app, evitando prop drilling.
- **useTasks hook:** usa `onSnapshot` de Firestore para escuchar cambios en tiempo real, sin necesidad de refrescar manualmente.

---

## Variables de entorno

Crear un archivo `.env` en la raíz basándose en `.env.example`:

```env
# Firebase (expuestas al frontend via VITE_)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# AWS SES — solo en Vercel Functions (sin VITE_)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
SES_FROM_EMAIL=
SES_TO_EMAIL=      # opcional; si se omite, se usa el email del usuario logueado
```

> Las variables `AWS_*` y `SES_*` **nunca** deben tener el prefijo `VITE_` — de lo contrario quedarían expuestas en el bundle del cliente.

---

## Instalación local

```bash
git clone https://github.com/gkovalek/RepositorioHenry.git
cd RepositorioHenry
npm install
cp .env.example .env   # completar con tus credenciales
npm run dev            # http://localhost:5173
```

Para probar las Vercel Functions localmente:

```bash
npm install -g vercel
vercel dev             # http://localhost:3000
```

---

## Tests

```bash
npm run test         # modo watch
npm run test:run     # ejecución única
```

Cobertura:
- **Tests de componentes:** `TodoForm`, `TodoList`
- **Tests unitarios:** `errorMessages`, operaciones de `firestore`
- **Mocks:** Firebase está mockeado para aislar los tests de servicios externos

---

## Flujo de envío de emails

```
Usuario (browser)
      │
      │  POST /api/sendEmail  { pending[], done[], date, userEmail }
      ▼
Vercel Function (api/sendEmail.ts)
      │  Lee AWS_* y SES_FROM_EMAIL de las variables de entorno
      │  Construye un email HTML con diseño dark (slate/indigo)
      ▼
AWS SES (us-east-2)
      │  Envía desde SES_FROM_EMAIL hacia userEmail (o SES_TO_EMAIL si está definida)
      ▼
Bandeja del usuario
```

Los secretos de AWS **solo existen en el servidor** (Vercel Functions). El frontend únicamente envía el contenido del resumen y el email del usuario autenticado.

---

## Integración de IA en el proceso de desarrollo

Utilicé Claude (Claude Code) como asistente a lo largo de todo el proyecto. Las situaciones donde fue más efectivo:

- **Debugging de configuración:** diagnosticó el problema de AWS SES Sandbox (emails no verificados) y guió el proceso paso a paso a través de las capturas de pantalla de la consola de AWS y Vercel.
- **Generación de HTML para emails:** a partir de los colores Tailwind de la app (`slate-950`, `indigo-500`, `emerald-400`) construyó un template HTML compatible con clientes de email, usando inline styles.
- **Comprensión de errores de Firebase:** tradujo mensajes de error técnicos de Firebase Auth a mensajes amigables en español.

**Patrón más valioso descubierto:** darle contexto visual (screenshots) además de texto permitió diagnósticos mucho más precisos que solo describir el problema en palabras. El modelo pudo ver exactamente el estado de la consola de AWS y señalar el problema real (región incorrecta, campos vacíos) sin necesidad de suposiciones.
