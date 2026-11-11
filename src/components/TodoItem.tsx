import { useState, type CSSProperties } from 'react'
import { toggleComplete, deleteTask, updateTask } from '../services/firestore'
import type { Task } from '../types/task'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-100 ' +
  'placeholder:text-slate-500 transition-colors duration-150 ' +
  'focus:outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/60'

interface Props {
  task: Task
  userId: string
  index?: number
}

export default function TodoItem({ task, userId, index = 0 }: Props) {
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

  const itemStyle = { '--i': index } as CSSProperties

  if (editing) {
    return (
      <li
        className="task-item-enter rounded-xl border border-indigo-500/30 bg-slate-900/80 backdrop-blur-sm p-4 space-y-3"
        style={itemStyle}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={`${inputClass} resize-none`}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-xs bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-lg disabled:opacity-50 font-semibold transition-colors"
          >
            Guardar
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-slate-400 hover:text-slate-200 px-4 py-1.5 rounded-lg hover:bg-white/5 font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </li>
    )
  }

  return (
    <li
      className={`task-item-enter rounded-xl border backdrop-blur-sm p-4 flex items-start gap-3 transition-all duration-200 ${
        task.completed
          ? 'opacity-40 border-white/5 bg-slate-900/40'
          : 'border-white/10 bg-slate-900/60 hover:border-indigo-500/30 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-indigo-950/20'
      }`}
      style={itemStyle}
    >
      {/* Custom circular checkbox */}
      <button
        onClick={handleToggle}
        aria-label={task.completed ? 'Marcar pendiente' : 'Marcar completada'}
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
          task.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-slate-600 hover:border-indigo-400'
        }`}
      >
        {task.completed && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            task.completed ? 'line-through text-slate-500' : 'text-slate-100'
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{task.description}</p>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-slate-500 hover:text-indigo-400 font-medium px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="text-xs text-slate-500 hover:text-red-400 font-medium px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}
