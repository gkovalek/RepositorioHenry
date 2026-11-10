const firebaseErrors: Record<string, string> = {
  'auth/email-already-in-use': 'Este email ya está registrado.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/user-not-found': 'No existe una cuenta con este email.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Intentá más tarde.',
  'auth/network-request-failed': 'Error de red. Verificá tu conexión.',
}

export function mapFirebaseError(code: string): string {
  return firebaseErrors[code] ?? 'Ocurrió un error inesperado.'
}
