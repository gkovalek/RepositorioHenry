import { useState, type FormEvent } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../services/firebase'
import { mapFirebaseError } from '../utils/errorMessages'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden md:flex flex-col justify-between bg-slate-900 w-[45%] p-12">
        <span className="text-indigo-400 font-bold text-xl tracking-tight">MemoryClip</span>
        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Organizá tu día,<br />sin perder el hilo.
          </h2>
          <p className="text-slate-400 text-base">
            Tus tareas en la nube, sincronizadas en tiempo real.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="h-1.5 w-8 bg-indigo-500 rounded-full" />
          <div className="h-1.5 w-3 bg-slate-700 rounded-full" />
          <div className="h-1.5 w-3 bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <span className="text-indigo-600 font-bold text-xl tracking-tight">MemoryClip</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">Bienvenido de vuelta</h1>
          <p className="text-slate-500 text-sm mb-8">Iniciá sesión para continuar</p>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
