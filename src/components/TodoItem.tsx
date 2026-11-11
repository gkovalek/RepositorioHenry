import { useState } from 'react'
import { toggleComplete, deleteTask, updateTask } from '../services/firestore'
import type { Task } from '../types/task'

interface Props {
  task: Task
  userId: string
}

export default function TodoItem({ task, userId }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    await toggleComplete(userId, task.id, !task.completed)
  }

  async function handleDelete() {
    await deleteTask(userId, task.id)
  }

  async function handleSave() {
    if (!title.trim()) return
    setLoading(true)
    await updateTask(userId, task.id, { title: title.trim(), description: description.trim() })
    setLoading(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="bg-white rounded-xl border border-indigo-200 shadow-sm p-4 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-xs bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-semibold transition-colors"
          >
            Guardar
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-slate-500 px-4 py-1.5 rounded-lg hover:bg-slate-100 font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className={`bg-white rounded-xl border shadow-sm p-4 flex items-start gap-3 transition-all ${
      task.completed ? 'opacity-50 border-slate-100' : 'border-slate-200 hover:border-indigo-200 hover:shadow-md'
    }`}>
      {/* Custom circular checkbox */}
      <button
        onClick={handleToggle}
        aria-label={task.completed ? 'Marcar pendiente' : 'Marcar completada'}
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? 'bg-indigo-600 border-indigo-600'
            : 'border-slate-300 hover:border-indigo-400'
        }`}
      >
        {task.completed && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{task.description}</p>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-slate-400 hover:text-indigo-600 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="text-xs text-slate-400 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}
