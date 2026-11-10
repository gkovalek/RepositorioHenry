import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TodoForm from '../../src/components/TodoForm'

const mockCreateTask = vi.fn()

vi.mock('../../src/services/firestore', () => ({
  createTask: (...args: unknown[]) => mockCreateTask(...args),
}))

vi.mock('../../src/services/firebase', () => ({ db: {} }))

describe('TodoForm', () => {
  beforeEach(() => vi.clearAllMocks())
  it('renders title and description inputs plus submit button', () => {
    render(<TodoForm userId="user1" />)
    expect(screen.getByPlaceholderText('Título')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Descripción (opcional)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /agregar tarea/i })).toBeInTheDocument()
  })

  it('calls createTask with form values on submit', async () => {
    mockCreateTask.mockResolvedValueOnce(undefined)
    render(<TodoForm userId="user1" />)

    fireEvent.change(screen.getByPlaceholderText('Título'), {
      target: { value: 'Nueva tarea' },
    })
    fireEvent.change(screen.getByPlaceholderText('Descripción (opcional)'), {
      target: { value: 'Descripción de prueba' },
    })
    fireEvent.click(screen.getByRole('button', { name: /agregar tarea/i }))

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith('user1', 'Nueva tarea', 'Descripción de prueba')
    })
  })

  it('does not submit with empty title', async () => {
    render(<TodoForm userId="user1" />)
    fireEvent.click(screen.getByRole('button', { name: /agregar tarea/i }))
    expect(mockCreateTask).not.toHaveBeenCalled()
  })
})
