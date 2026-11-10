import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockAddDoc, mockUpdateDoc, mockDeleteDoc, mockServerTimestamp, mockCollection, mockDoc } = vi.hoisted(() => ({
  mockAddDoc: vi.fn(),
  mockUpdateDoc: vi.fn(),
  mockDeleteDoc: vi.fn(),
  mockServerTimestamp: vi.fn(() => ({ seconds: 0, nanoseconds: 0 })),
  mockCollection: vi.fn((_db: unknown, ...segments: string[]) => ({ path: segments.join('/') })),
  mockDoc: vi.fn((_db: unknown, ...segments: string[]) => ({ path: segments.join('/') })),
}))

vi.mock('firebase/firestore', () => ({
  collection: mockCollection,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
  serverTimestamp: mockServerTimestamp,
}))

vi.mock('../../src/services/firebase', () => ({ db: {} }))

import { createTask, toggleComplete, deleteTask } from '../../src/services/firestore'

describe('createTask', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls addDoc with correct data', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'abc' })
    await createTask('user1', 'Mi tarea', 'Descripción')

    expect(mockAddDoc).toHaveBeenCalledOnce()
    const [, data] = mockAddDoc.mock.calls[0]
    expect(data.title).toBe('Mi tarea')
    expect(data.description).toBe('Descripción')
    expect(data.userId).toBe('user1')
    expect(data.completed).toBe(false)
  })
})

describe('toggleComplete', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls updateDoc with completed flag', async () => {
    mockUpdateDoc.mockResolvedValueOnce(undefined)
    await toggleComplete('user1', 'task1', true)

    expect(mockUpdateDoc).toHaveBeenCalledOnce()
    const [, data] = mockUpdateDoc.mock.calls[0]
    expect(data).toEqual({ completed: true })
  })
})

describe('deleteTask', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls deleteDoc', async () => {
    mockDeleteDoc.mockResolvedValueOnce(undefined)
    await deleteTask('user1', 'task1')
    expect(mockDeleteDoc).toHaveBeenCalledOnce()
  })
})
