import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const api  = axios.create({ baseURL: BASE })

export const getUser       = ()       => api.get('/api/user').then(r => r.data)
export const updateUser    = (data)   => api.put('/api/user', data).then(r => r.data)
export const generateOutfit= (data)   => api.post('/api/outfit/generate-with-ai', data).then(r => r.data)
export const saveOutfit    = (data)   => api.post('/api/outfit/save', data).then(r => r.data)
export const getHistory    = ()       => api.get('/api/outfit/history').then(r => r.data)
export const rateOutfit    = (id, r)  => api.put(`/api/outfit/${id}/rate/${r}`).then(r => r.data)
export const favOutfit     = (id)     => api.put(`/api/outfit/${id}/favourite`).then(r => r.data)
export const getWardrobe   = ()       => api.get('/api/wardrobe').then(r => r.data)
export const addWardrobeItem=(data)   => api.post('/api/wardrobe', data).then(r => r.data)
export const deleteWardrobeItem=(id)  => api.delete(`/api/wardrobe/${id}`).then(r => r.data)
export const clearWardrobe = ()       => api.delete('/api/wardrobe').then(r => r.data)
export const favWardrobeItem=(id)     => api.put(`/api/wardrobe/${id}/favourite`).then(r => r.data)
export const markWorn      = (id)     => api.put(`/api/wardrobe/${id}/worn`).then(r => r.data)
export const getAnalytics  = ()       => api.get('/api/wardrobe/analytics').then(r => r.data)
export const getCatalogue  = (params) => api.get('/api/catalogue', { params }).then(r => r.data)
export const getTrends     = ()       => api.get('/api/trends').then(r => r.data)
