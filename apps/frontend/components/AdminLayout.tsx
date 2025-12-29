'use client'

import { ProLayout } from '@ant-design/pro-components'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { App, Button, Dropdown, Space, ConfigProvider, theme } from 'antd'
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      path: '/admin',
      name: '仪表盘',
      icon: <DashboardOutlined />,
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

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
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
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              {logo}
              {!collapsed && <span style={{ fontSize: 16, fontWeight: 600, color: '#1f1f1f' }}>{title}</span>}
            </Link>
          )}
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
