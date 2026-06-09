const AUTH_KEY = 'crepe_auth'

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export function setAuthenticated(): void {
  localStorage.setItem(AUTH_KEY, 'true')
}

export function clearAuthenticated(): void {
  localStorage.removeItem(AUTH_KEY)
}
