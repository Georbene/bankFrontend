import axios from "axios"


const api = axios.create({
  baseURL: window._env_?.API_URL || "https://bankbackend-s7dw.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token")
      window.location.href = "/signin"
    }
    return Promise.reject(error)
  },
)

export default api
