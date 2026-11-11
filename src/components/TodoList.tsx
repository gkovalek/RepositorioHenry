import TodoItem from './TodoItem'
import type { Task } from '../types/task'

interface Props {
  tasks: Task[]
  userId: string
  loading: boolean
  error: string | null
}

export default function TodoList({ tasks, userId, loading, error }: Props) {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-500">Cargando tareas…</p>
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-600 text-center py-8">{error}</p>
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-sm font-medium text-slate-600">No tenés tareas aún</p>
        <p className="text-xs text-slate-400 mt-1">Agregá tu primera tarea arriba</p>
      </div>
    )
  }

  const pending = tasks.filter((t) => !t.completed)
  const done = tasks.filter((t) => t.completed)

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Pendientes · {pending.length}
          </h4>
          <ul className="space-y-2">
            {pending.map((task) => (
              <TodoItem key={task.id} task={task} userId={userId} />
            ))}
          </ul>
        </section>
      )}

      {done.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Completadas · {done.length}
          </h4>
          <ul className="space-y-2">
            {done.map((task) => (
              <TodoItem key={task.id} task={task} userId={userId} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
