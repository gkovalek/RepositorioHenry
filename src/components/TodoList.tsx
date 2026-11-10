import TodoItem from './TodoItem'
import type { Task } from '../types/task'

interface Props {
  tasks: Task[]
  userId: string
  loading: boolean
  error: string | null
}

export default function TodoList({ tasks, userId, loading, error }: Props) {
  if (loading) return <p className="text-sm text-gray-500 text-center py-8">Cargando tareas…</p>
  if (error) return <p className="text-sm text-red-600 text-center py-8">{error}</p>
  if (tasks.length === 0) return <p className="text-sm text-gray-400 text-center py-8">No tenés tareas aún.</p>

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TodoItem key={task.id} task={task} userId={userId} />
      ))}
    </ul>
  )
}
