import { api } from './api.js'

export async function getFavorites() {
  return api.get('/opportunities/favorites')
}
