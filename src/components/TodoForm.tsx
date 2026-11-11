import { useState, type FormEvent } from 'react'
import { createTask } from '../services/firestore'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 ' +
  'placeholder:text-slate-500 transition-colors duration-150 ' +
  'hover:border-white/20 focus:outline-none focus-visible:border-indigo-400 ' +
  'focus-visible:ring-2 focus-visible:ring-indigo-400/60'

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
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-md p-5 mb-6 shadow-2xl shadow-indigo-950/30"
    >
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Nueva tarea
      </h3>

      {error && (
        <p className="text-red-400 text-xs mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué tenés que hacer?"
          className={inputClass}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          rows={2}
          className={`${inputClass} resize-none`}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-[background-color,transform] duration-150 ease-out hover:bg-indigo-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          {loading ? 'Guardando…' : '+ Agregar tarea'}
        </button>
      </div>
    </form>
  )
}
