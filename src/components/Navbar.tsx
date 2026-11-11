import { useAuth } from '../features/auth/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <span className="font-bold text-blue-600 text-lg">MemoryClip</span>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-700 hover:text-red-600 font-medium transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  )
}
