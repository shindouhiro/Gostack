import { message } from 'antd'

// API 基础路径
const API_BASE = '/api/v1'

// 请求配置
interface RequestConfig extends RequestInit {
  showError?: boolean  // 是否显示错误提示
  showLoading?: boolean // 是否显示 loading
}

// 响应类型
interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
}

// 请求拦截器
const requestInterceptor = (url: string, config: RequestConfig): RequestConfig => {
  // 添加默认 headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...config.headers,
  }

  // 添加 token（如果有）
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  return {
    ...config,
    headers,
  }
}

// 响应拦截器
const responseInterceptor = async <T>(
  response: Response,
  config: RequestConfig
): Promise<T> => {
  // 处理 HTTP 错误状态
  if (!response.ok) {
    const errorMessage = getHttpErrorMessage(response.status)
    if (config.showError !== false) {
      message.error(errorMessage)
    }
    throw new Error(errorMessage)
  }

  // 解析响应数据
  const data = await response.json()

  return data as T
}

// HTTP 错误信息映射
const getHttpErrorMessage = (status: number): string => {
  const errorMap: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求资源不存在',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
  }
  return errorMap[status] || `请求失败 (${status})`
}

// 封装请求方法
async function request<T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`

  try {
    // 应用请求拦截器
    const finalConfig = requestInterceptor(url, config)

    // 发起请求
    const response = await fetch(url, finalConfig)

    // 应用响应拦截器
    return await responseInterceptor<T>(response, config)
  } catch (error) {
    // 网络错误处理
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      if (config.showError !== false) {
        message.error('网络连接失败，请检查网络')
      }
    }
    throw error
  }
}

// 导出便捷方法
export const http = {
  get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, { ...config, method: 'GET' })
  },

  post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>(endpoint, { ...config, method: 'DELETE' })
  },
}

export default http
