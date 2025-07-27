import { api } from './api.js'

export async function getProfile() {
  return api.get('/users/me')
}

export async function updateProfile(data) {
  return api.put('/users/me', data)
}

export async function updateNotifications(data) {
  return api.put('/users/me/notifications', data)
}
