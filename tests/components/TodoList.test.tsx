import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TodoList from '../../src/components/TodoList'
import type { Task } from '../../src/types/task'
import { Timestamp } from 'firebase/firestore'

vi.mock('../../src/services/firestore', () => ({
  toggleComplete: vi.fn(),
  deleteTask: vi.fn(),
  updateTask: vi.fn(),
}))

vi.mock('../../src/services/firebase', () => ({ db: {} }))

const mockTasks: Task[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Tarea pendiente',
    description: '',
    completed: false,
    createdAt: { seconds: 0, nanoseconds: 0 } as Timestamp,
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Tarea completada',
    description: 'Con descripción',
    completed: true,
    createdAt: { seconds: 1, nanoseconds: 0 } as Timestamp,
  },
]

describe('TodoList', () => {
  it('renders all tasks', () => {
    render(<TodoList tasks={mockTasks} userId="user1" loading={false} error={null} />)
    expect(screen.getByText('Tarea pendiente')).toBeInTheDocument()
    expect(screen.getByText('Tarea completada')).toBeInTheDocument()
  })

  it('shows loading message', () => {
    render(<TodoList tasks={[]} userId="user1" loading={true} error={null} />)
    expect(screen.getByText(/cargando tareas/i)).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    render(<TodoList tasks={[]} userId="user1" loading={false} error={null} />)
    expect(screen.getByText(/no tenés tareas/i)).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<TodoList tasks={[]} userId="user1" loading={false} error="Error de red" />)
    expect(screen.getByText('Error de red')).toBeInTheDocument()
  })
})
