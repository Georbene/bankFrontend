"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on page load
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token")

      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const response = await api.get("/api/users/me")
          setCurrentUser(response.data)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Authentication error:", error)
          localStorage.removeItem("token")
          delete api.defaults.headers.common["Authorization"]
        }
      }

      setLoading(false)
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setCurrentUser(user)
      setIsAuthenticated(true)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post("/api/auth/register", userData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const createPin = async (pin) => {
    try {
      await api.post("/api/users/create-pin", { pin })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create PIN",
      }
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    createPin,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
