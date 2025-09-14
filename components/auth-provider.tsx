"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { User } from "@/lib/types"
import { getMemberProfile } from "@/lib/services/member"

interface AuthContextType {
  user: User | null
  login: () => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize from localStorage or fetch using token
    const initializeAuth = async () => {
      try {
        const storedProfile = localStorage.getItem("pickdong_user")
        if (storedProfile) {
          // storedProfile expected shape: { email }
          const profile = JSON.parse(storedProfile) as { email?: string }
          if (profile && profile.email) {
            setUser({
              email: profile.email,
            })
            setIsLoading(false)
            return
          }
        }

        const token = localStorage.getItem("pickdong_token")
        if (token) {
          const profile = await getMemberProfile()
          // Persist only email as requested
          localStorage.setItem("pickdong_user", JSON.stringify({ email: profile.email }))
          setUser({
            email: profile.email,
          })
        }
      } catch (error) {
        // On error, keep user null
        console.error("Failed to initialize auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock user data based on provider
    const mockUser: User = { email: "pickdong@gmail.com" }

    setUser(mockUser)
    // Store only email for mock login in dev
    localStorage.setItem("pickdong_user", JSON.stringify({ email: mockUser.email }))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pickdong_user")
    localStorage.removeItem("pickdong_token")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
