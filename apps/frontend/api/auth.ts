import http from '@/lib/request'

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
}

// 用户信息
export interface UserInfo {
  Id: number
  Username: string
  Nickname: string
  Avatar: string
  Role: string
  CreatedAt: string
  UpdatedAt: string
}

// 登录响应
export interface LoginResponse {
  token: string
  user: UserInfo
}

// API 响应包装
interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

// 认证 API
export const authApi = {
  // 登录
  login(params: LoginParams): Promise<ApiResponse<LoginResponse>> {
    return http.post<ApiResponse<LoginResponse>>('/auth/login', params, { showError: false })
  },

  // 获取用户信息
  getUserInfo(): Promise<ApiResponse<UserInfo>> {
    return http.get<ApiResponse<UserInfo>>('/auth/userinfo', { showError: false })
  },

  // 登出
  logout(): Promise<ApiResponse<null>> {
    return http.post<ApiResponse<null>>('/auth/logout')
  },
}

export default authApi
