import Axios from 'axios'

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: false,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('codekart_auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
