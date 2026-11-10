import { useState } from 'react'
import Navbar from '../components/Navbar'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import { useAuth } from '../features/auth/AuthContext'
import { useTasks } from '../hooks/useTasks'

export default function Tasks() {
  const { user } = useAuth()
  const { tasks, loading, error } = useTasks(user?.uid ?? null)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  if (!user) return null

  async function handleSendSummary() {
    setEmailStatus('sending')
    const pending = tasks.filter((t) => !t.completed)
    const done = tasks.filter((t) => t.completed)

    const summary =
      `Resumen de tareas — ${new Date().toLocaleDateString('es-AR')}\n\n` +
      `Pendientes (${pending.length}):\n` +
      pending.map((t) => `• ${t.title}`).join('\n') +
      `\n\nCompletadas (${done.length}):\n` +
      done.map((t) => `✓ ${t.title}`).join('\n')

    try {
      const res = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary, userEmail: user!.email }),
      })
      if (!res.ok) throw new Error()
      setEmailStatus('sent')
      setTimeout(() => setEmailStatus('idle'), 4000)
    } catch {
      setEmailStatus('error')
      setTimeout(() => setEmailStatus('idle'), 4000)
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mis tareas</h2>
          <button
            onClick={handleSendSummary}
            disabled={emailStatus === 'sending' || tasks.length === 0}
            className="text-sm bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            {emailStatus === 'sending' && 'Enviando…'}
            {emailStatus === 'sent' && '✓ Enviado'}
            {emailStatus === 'error' && 'Error al enviar'}
            {emailStatus === 'idle' && 'Enviar resumen'}
          </button>
        </div>

        {emailStatus === 'sent' && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
            Resumen enviado por email correctamente.
          </div>
        )}
        {emailStatus === 'error' && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            No se pudo enviar el email. Verificá la configuración de AWS SES.
          </div>
        )}

        <TodoForm userId={user.uid} />
        <TodoList tasks={tasks} userId={user.uid} loading={loading} error={error} />
      </main>
    </>
  )
}
