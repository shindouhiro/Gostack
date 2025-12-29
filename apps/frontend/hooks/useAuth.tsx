'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { message } from 'antd'
import authApi, { UserInfo, LoginParams } from '@/api/auth'

// Token 存储 key
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

// 获取 token
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

// 设置 token
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

// 移除 token
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// 获取缓存的用户信息
export function getCachedUser(): UserInfo | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem(USER_KEY)
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }
  return null
}

// 缓存用户信息
export function setCachedUser(user: UserInfo): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Auth Context
interface AuthContextType {
  user: UserInfo | null
  loading: boolean
  isAuthenticated: boolean
  login: (params: LoginParams) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Auth Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 获取用户信息
  const refreshUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await authApi.getUserInfo()
      if (res.success && res.data) {
        setUser(res.data)
        setCachedUser(res.data)
      } else {
        removeToken()
        setUser(null)
      }
    } catch (error) {
      removeToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // 初始化
  useEffect(() => {
    // 先尝试从缓存获取
    const cachedUser = getCachedUser()
    if (cachedUser) {
      setUser(cachedUser)
    }
    // 然后验证 token
    refreshUser()
  }, [refreshUser])

  // 登录
  const login = useCallback(async (params: LoginParams): Promise<boolean> => {
    try {
      const res = await authApi.login(params)
      if (res.success && res.data) {
        setToken(res.data.token)
        setUser(res.data.user)
        setCachedUser(res.data.user)
        message.success('登录成功')
        return true
      } else {
        message.error(res.message || '登录失败')
        return false
      }
    } catch (error) {
      message.error('登录失败，请检查网络')
      return false
    }
  }, [])

  // 登出
  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // 忽略错误
    } finally {
      removeToken()
      setUser(null)
      router.push('/login')
      message.success('已退出登录')
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// 使用 Auth Context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 路由守卫 Hook
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  return { isAuthenticated, loading }
}
