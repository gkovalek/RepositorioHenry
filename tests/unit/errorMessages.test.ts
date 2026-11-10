import { describe, it, expect } from 'vitest'
import { mapFirebaseError } from '../../src/utils/errorMessages'

describe('mapFirebaseError', () => {
  it('maps known error codes to Spanish messages', () => {
    expect(mapFirebaseError('auth/email-already-in-use')).toBe('Este email ya está registrado.')
    expect(mapFirebaseError('auth/wrong-password')).toBe('Contraseña incorrecta.')
    expect(mapFirebaseError('auth/user-not-found')).toBe('No existe una cuenta con este email.')
    expect(mapFirebaseError('auth/weak-password')).toBe('La contraseña debe tener al menos 6 caracteres.')
  })

  it('returns a fallback message for unknown codes', () => {
    expect(mapFirebaseError('auth/unknown-code')).toBe('Ocurrió un error inesperado.')
    expect(mapFirebaseError('')).toBe('Ocurrió un error inesperado.')
  })
})
