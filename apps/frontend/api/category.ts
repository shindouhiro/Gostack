import http from '@/lib/request'

// 分类类型定义
export interface Category {
  Id: number
  Name: string
  ParentId: number
  Order: number
}

// 创建分类参数
export interface CreateCategoryParams {
  Name: string
  ParentId?: number
  Order?: number
}

// 更新分类参数
export interface UpdateCategoryParams {
  Name?: string
  ParentId?: number
  Order?: number
}

// 分类 API
export const categoryApi = {
  // 获取所有分类
  getAll(): Promise<Category[]> {
    return http.get<Category[]>('/categories')
  },

  // 获取单个分类
  getById(id: number): Promise<Category> {
    return http.get<Category>(`/categories/${id}`)
  },

  // 创建分类
  create(data: CreateCategoryParams): Promise<{ id: number }> {
    return http.post<{ id: number }>('/categories', data)
  },

  // 更新分类
  update(id: number, data: UpdateCategoryParams): Promise<string> {
    return http.put<string>(`/categories/${id}`, data)
  },

  // 删除分类
  delete(id: number): Promise<string> {
    return http.delete<string>(`/categories/${id}`)
  },
}

export default categoryApi
