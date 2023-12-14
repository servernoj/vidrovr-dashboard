import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
api.interceptors.response.use(
  response => response.data
)

export default api
