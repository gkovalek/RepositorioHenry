import { useState, type FormEvent } from 'react'
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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Nueva tarea</h3>

      {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

      <div className="space-y-3">
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué tenés que hacer?"
          className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          rows={2}
          className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Guardando…' : '+ Agregar tarea'}
        </button>
      </div>
    </form>
  )
}
