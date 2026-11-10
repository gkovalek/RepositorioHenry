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
      <li className="bg-white rounded-xl border border-blue-300 p-4 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Guardar
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${task.completed ? 'opacity-60' : 'border-gray-200'}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        className="mt-0.5 h-4 w-4 cursor-pointer accent-blue-600"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-gray-800 ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
        {task.description && (
          <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="text-xs text-gray-400 hover:text-red-600 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}
