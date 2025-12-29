'use client'

import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import categoryApi, { Category, CreateCategoryParams, UpdateCategoryParams } from '@/api/category'

// 分类列表 Hook
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await categoryApi.getAll()
      // 处理后端返回的数据（可能是 null 或数组）
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err as Error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
  }
}

// 分类操作 Hook
export function useCategoryActions() {
  const [loading, setLoading] = useState(false)

  // 创建分类
  const createCategory = useCallback(async (data: CreateCategoryParams) => {
    setLoading(true)
    try {
      const result = await categoryApi.create(data)
      message.success('创建成功')
      return result
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // 更新分类
  const updateCategory = useCallback(async (id: number, data: UpdateCategoryParams) => {
    setLoading(true)
    try {
      const result = await categoryApi.update(id, data)
      message.success('更新成功')
      return result
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // 删除分类
  const deleteCategory = useCallback(async (id: number) => {
    setLoading(true)
    try {
      const result = await categoryApi.delete(id)
      message.success('删除成功')
      return result
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}

// 获取父分类名称的工具函数
export function getParentCategoryName(categories: Category[], parentId: number): string {
  if (parentId === 0) return '无'
  const parent = categories.find(c => c.Id === parentId)
  return parent?.Name || '未知'
}
