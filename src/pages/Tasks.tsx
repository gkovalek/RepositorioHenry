import { useState, type CSSProperties } from 'react'
import Navbar from '../components/Navbar'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'
import { useAuth } from '../features/auth/AuthContext'
import { useTasks } from '../hooks/useTasks'
import ParticleField from '../components/ParticleField'

const stagger = (i: number) => ({ '--i': i }) as CSSProperties

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
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950">
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(79,70,229,0.15),transparent)]"
      />
      <ParticleField className="-z-10" />

      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="dash-enter flex items-start justify-between mb-8" style={stagger(0)}>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Mis tareas</h1>
            <p className="text-sm text-slate-400 mt-1">
              <span className="text-indigo-400 font-semibold">{pending.length}</span>{' '}
              pendiente{pending.length !== 1 ? 's' : ''}{' '}
              <span className="text-slate-600 mx-1">·</span>{' '}
              <span className="text-slate-300">{done.length}</span>{' '}
              completada{done.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={handleSendSummary}
            disabled={emailStatus === 'sending' || tasks.length === 0}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all shrink-0 border ${
              emailStatus === 'sent'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : emailStatus === 'error'
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:border-indigo-400/50 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {emailStatus === 'sending' && 'Enviando…'}
            {emailStatus === 'sent' && '✓ Enviado'}
            {emailStatus === 'error' && '✕ Error'}
            {emailStatus === 'idle' && 'Enviar resumen'}
          </button>
        </div>

        {/* Stats pills */}
        <div className="dash-enter grid grid-cols-2 gap-3 mb-6" style={stagger(1)}>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-sm px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-indigo-400">{pending.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-sm px-5 py-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Completadas</p>
            <p className="text-3xl font-bold text-emerald-400">{done.length}</p>
          </div>
        </div>

        {/* Form */}
        <div className="dash-enter" style={stagger(2)}>
          <TodoForm userId={user.uid} />
        </div>

        {/* List */}
        <div className="dash-enter" style={stagger(3)}>
          <TodoList tasks={tasks} userId={user.uid} loading={loading} error={error} />
        </div>
      </main>
    </div>
  )
}
