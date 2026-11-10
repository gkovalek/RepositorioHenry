import { vi } from 'vitest'

export const auth = { currentUser: null }

export const db = {}

vi.mock('../../src/services/firebase', () => ({
  auth,
  db,
}))
