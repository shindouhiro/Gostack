'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spin } from 'antd'
import { getToken } from '@/hooks/useAuth'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态
    const token = getToken()
    if (token) {
      router.replace('/admin')
    } else {
      router.replace('/login')
    }
  }, [router])

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f7fa',
    }}>
      <Spin size="large" />
    </div>
  )
}
