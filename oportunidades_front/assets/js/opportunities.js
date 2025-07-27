import { api } from './api.js'
import { isAuthenticated } from './auth.js'

export async function loadOpportunities(filters = {}) {
  return api.get('/opportunities', filters)
}

export async function loadOpportunity(id) {
  return api.get(`/opportunities/${id}`)
}

export async function getFavoritesIds() {
  if (!isAuthenticated()) return []
  const list = await api.get('/opportunities/favorites')
  return list.map(o => o.id)
}

export async function isFavorite(id) {
  const ids = await getFavoritesIds()
  return ids.includes(Number(id))
}

export async function toggleFavorite(id, currentlyFavorite) {
  if (currentlyFavorite) {
    await api.delete(`/opportunities/${id}/favorite`)
    return false
  } else {
    await api.post(`/opportunities/${id}/favorite`)
    return true
  }
}

export async function requireAuthIfAction() {
  if (!isAuthenticated()) window.location.href = 'login.html'
}
