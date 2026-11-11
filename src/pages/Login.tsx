import { useId, useState, type CSSProperties, type FormEvent } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../services/firebase'
import { mapFirebaseError } from '../utils/errorMessages'
import ParticleField from '../components/ParticleField'

/** Stagger index for .reveal-item (see index.css). */
const stagger = (i: number) => ({ '--i': i }) as CSSProperties

const inputClass =
  'w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 ' +
  'placeholder:text-slate-500 transition-colors duration-150 ' +
  'hover:border-white/20 focus:outline-none focus-visible:border-indigo-400 ' +
  'focus-visible:ring-2 focus-visible:ring-indigo-400/60'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const emailId = useId()
  const passwordId = useId()
  const errorId = useId()
  const titleId = useId()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/tasks')
    } catch (err: any) {
      setError(mapFirebaseError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      {/* Soft radial glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.18),transparent_60%)]"
      />
      <ParticleField className="-z-10" />

      <section
        aria-labelledby={titleId}
        className="reveal-card w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-md sm:p-8"
      >
        <span
          className="reveal-item mb-6 block text-lg font-bold tracking-tight text-indigo-400"
          style={stagger(0)}
        >
          MemoryClip
        </span>

        <h1
          id={titleId}
          className="reveal-item mb-1 text-2xl font-bold text-white"
          style={stagger(1)}
        >
          Bienvenido de vuelta
        </h1>
        <p className="reveal-item mb-7 text-sm text-slate-400" style={stagger(2)}>
          Iniciá sesión para continuar
        </p>

        {error && (
          <div
            id={errorId}
            role="alert"
            className="reveal-alert mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="reveal-item" style={stagger(3)}>
            <label htmlFor={emailId} className="mb-1.5 block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={inputClass}
              placeholder="tu@email.com"
            />
          </div>

          <div className="reveal-item" style={stagger(4)}>
            <label htmlFor={passwordId} className="mb-1.5 block text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={inputClass}
              placeholder="Tu contraseña"
            />
          </div>

          <div className="reveal-item pt-1" style={stagger(5)}>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-[background-color,transform] duration-150 ease-out hover:bg-indigo-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </button>
          </div>
        </form>

        <p className="reveal-item mt-6 text-center text-sm text-slate-400" style={stagger(6)}>
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            className="rounded font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Registrate
          </Link>
        </p>
      </section>
    </main>
  )
}
