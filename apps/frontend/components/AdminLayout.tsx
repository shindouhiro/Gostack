'use client'

import { ProLayout } from '@ant-design/pro-components'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { App, Button, Dropdown, Space, Layout } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import Link from 'next/link'

const { Header, Content } = Layout

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      path: '/admin',
      name: '仪表盘',
      icon: 'DashboardOutlined',
    },
    {
      path: '/admin/categories',
      name: '分类管理',
      icon: 'AppstoreOutlined',
    },
  ]

  const menuData = menuItems.map(item => ({
    path: item.path,
    name: item.name,
    icon: item.icon,
  }))

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
    },
  ]

  return (
    <App>
      <ProLayout
        title="后台管理系统"
        logo="/logo.png"
        layout="side"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        location={{
          pathname,
        }}
        route={{
          path: '/admin',
          routes: menuData,
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
            />
          </div>
        )}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          size: 'small',
          title: '管理员',
          render: (props, dom) => (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                {dom}
              </Space>
            </Dropdown>
          ),
        }}
        menuHeaderRender={(logo, title) => (
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {logo}
            {!collapsed && title}
          </Link>
        )}
        style={{ minHeight: '100vh' }}
      >
        <Content style={{ margin: 24, padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </ProLayout>
    </App>
  )
}