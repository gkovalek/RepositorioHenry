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

  const pending = tasks.filter((t) => !t.completed)
  const done = tasks.filter((t) => t.completed)

  async function handleSendSummary() {
    setEmailStatus('sending')
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Mis tareas</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {pending.length} pendiente{pending.length !== 1 ? 's' : ''} · {done.length} completada{done.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleSendSummary}
            disabled={emailStatus === 'sending' || tasks.length === 0}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all shrink-0 ${
              emailStatus === 'sent'
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : emailStatus === 'error'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40'
            }`}
          >
            {emailStatus === 'sending' && 'Enviando…'}
            {emailStatus === 'sent' && '✓ Enviado'}
            {emailStatus === 'error' && '✕ Error'}
            {emailStatus === 'idle' && 'Enviar resumen'}
          </button>
        </div>

        <TodoForm userId={user.uid} />
        <TodoList tasks={tasks} userId={user.uid} loading={loading} error={error} />
      </main>
    </div>
  )
}
