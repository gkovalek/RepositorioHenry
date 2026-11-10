import { useState, FormEvent } from 'react'
import { createTask } from '../services/firestore'

interface Props {
  userId: string
}

export default function TodoForm({ userId }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      await createTask(userId, title.trim(), description.trim())
      setTitle('')
      setDescription('')
    } catch {
      setError('No se pudo crear la tarea.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 space-y-3">
      <h3 className="font-semibold text-gray-800 text-sm">Nueva tarea</h3>

      {error && <p className="text-red-600 text-xs">{error}</p>}

      <input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción (opcional)"
        rows={2}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        {loading ? 'Guardando…' : 'Agregar tarea'}
      </button>
    </form>
  )
}
