import Navbar from '../components/Navbar'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import { useAuth } from '../features/auth/AuthContext'
import { useTasks } from '../hooks/useTasks'

export default function Tasks() {
  const { user } = useAuth()
  const { tasks, loading, error } = useTasks(user?.uid ?? null)

  if (!user) return null

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Mis tareas</h2>
        <TodoForm userId={user.uid} />
        <TodoList tasks={tasks} userId={user.uid} loading={loading} error={error} />
      </main>
    </>
  )
}
