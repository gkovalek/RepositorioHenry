import { useAuth } from '../features/auth/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const initial = user?.email?.[0].toUpperCase() ?? '?'

  return (
    <nav className="bg-slate-900 px-5 py-3.5 flex items-center justify-between">
      <span className="font-bold text-indigo-400 text-lg tracking-tight">MemoryClip</span>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:block">{user.email}</span>
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initial}
          </div>
          <button
            onClick={logout}
            className="text-xs text-slate-400 hover:text-white font-medium transition-colors border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg"
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  )
}
