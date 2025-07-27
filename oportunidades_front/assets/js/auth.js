import { api } from './api.js'

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}

export function ensureAuth(redirect = 'login.html') {
  if (!isAuthenticated()) window.location.href = redirect
}

export function redirectIfLogged(to = 'index.html') {
  if (isAuthenticated()) window.location.href = to
}

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password })
  api.setToken(res.token)
  return res
}

export async function register({ name, email, password, role }) {
  return api.post('/auth/register', { name, email, password, role })
}

export function logout() {
  api.clearToken()
  window.location.href = 'login.html'
}

export function mountAuthUI({ loginLink, profileLink, favoritesLink, logoutBtn }) {
  const auth = isAuthenticated()
  if (loginLink) loginLink.classList.toggle('hidden', auth)
  if (profileLink) profileLink.classList.toggle('hidden', !auth)
  if (favoritesLink) favoritesLink.classList.toggle('hidden', !auth)
  if (logoutBtn) {
    logoutBtn.classList.toggle('hidden', !auth)
    logoutBtn.addEventListener('click', logout)
  }
}

export async function me() {
  return api.get('/users/me')
}
