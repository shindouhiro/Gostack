'use client'

import { ProLayout } from '@ant-design/pro-components'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { App, Button, Dropdown, Space, ConfigProvider, theme, Spin } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { useAuth, useRequireAuth } from '@/hooks/useAuth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, loading: authLoading } = useAuth()
  const { isAuthenticated } = useRequireAuth()

  // 解决 SSR 水合问题
  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    {
      path: '/admin',
      name: '仪表盘',
      icon: <DashboardOutlined />,
      exact: true,
    },
    {
      path: '/admin/categories',
      name: '分类管理',
      icon: <AppstoreOutlined />,
    },
    {
      path: '/admin/posts',
      name: '文章管理',
      icon: <FileTextOutlined />,
    },
    {
      path: '/admin/tags',
      name: '标签管理',
      icon: <TagsOutlined />,
    },
  ]

  // 获取当前选中的菜单 key
  const getSelectedKeys = () => {
    // 精确匹配 /admin
    if (pathname === '/admin') return ['/admin']
    // 匹配子路由
    const item = menuItems.find(m => m.path !== '/admin' && pathname.startsWith(m.path))
    return item ? [item.path] : ['/admin']
  }

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
    } else if (key === 'profile') {
      router.push('/admin/profile')
    } else if (key === 'settings') {
      router.push('/admin/settings')
    }
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  // SSR 时显示 loading 或未认证时
  if (!mounted || authLoading) {
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

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          colorBgLayout: '#f5f7fa',
        },
        components: {
          Menu: {
            itemBg: 'transparent',
            subMenuItemBg: 'transparent',
          },
        },
      }}
    >
      <App>
        <ProLayout
          title="后台管理"
          logo={
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
            }}>
              M
            </div>
          }
          layout="side"
          fixSiderbar
          collapsed={collapsed}
          onCollapse={setCollapsed}
          location={{ pathname }}
          selectedKeys={getSelectedKeys()}
          route={{
            path: '/admin',
            routes: menuItems,
          }}
          menuItemRender={(item, dom) => (
            <Link href={item.path || '/admin'}>{dom}</Link>
          )}
          headerContentRender={() => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 16 }}
              />
            </div>
          )}
          avatarProps={{
            src: user?.Avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            size: 'small',
            title: user?.Nickname || user?.Username || '管理员',
            render: (props, dom) => (
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleMenuClick }}
                placement="bottomRight"
              >
                <Space style={{ cursor: 'pointer' }}>
                  {dom}
                </Space>
              </Dropdown>
            ),
          }}
          menuHeaderRender={(logo, title) => (
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              {logo}
              {!collapsed && <span style={{ fontSize: 16, fontWeight: 600, color: '#1f1f1f' }}>{title}</span>}
            </Link>
          )}
          bgLayoutImgList={[]}
          token={{
            sider: {
              colorMenuBackground: '#fff',
              colorMenuItemDivider: '#f0f0f0',
              colorTextMenu: '#595959',
              colorTextMenuSelected: '#1677ff',
              colorBgMenuItemSelected: '#e6f4ff',
              colorTextMenuItemHover: '#1677ff',
            },
            header: {
              colorBgHeader: '#fff',
              heightLayoutHeader: 56,
            },
          }}
          style={{ minHeight: '100vh' }}
          contentStyle={{
            margin: 0,
            padding: 0,
          }}
        >
          <div style={{
            padding: 24,
            minHeight: 'calc(100vh - 56px)',
            background: '#f5f7fa',
          }}>
            {children}
          </div>
        </ProLayout>
      </App>
    </ConfigProvider>
  )
}
