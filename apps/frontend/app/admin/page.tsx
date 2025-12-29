'use client'

import AdminLayout from '@/components/AdminLayout'
import { Card, Row, Col, Statistic, Space, Typography, List, Tag, Progress } from 'antd'
import {
  AppstoreOutlined,
  FileTextOutlined,
  TagsOutlined,
  EyeOutlined,
  RiseOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

export default function AdminDashboardPage() {
  const stats = [
    {
      title: '分类总数',
      value: 12,
      icon: <AppstoreOutlined />,
      color: '#1677ff',
      bgColor: '#e6f4ff',
    },
    {
      title: '文章总数',
      value: 128,
      icon: <FileTextOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed',
    },
    {
      title: '标签总数',
      value: 36,
      icon: <TagsOutlined />,
      color: '#faad14',
      bgColor: '#fffbe6',
    },
    {
      title: '总访问量',
      value: 9527,
      icon: <EyeOutlined />,
      color: '#722ed1',
      bgColor: '#f9f0ff',
    },
  ]

  const recentActivities = [
    { action: '创建了分类', target: '技术文章', time: '5分钟前', type: 'create' },
    { action: '编辑了文章', target: 'Go 入门教程', time: '15分钟前', type: 'edit' },
    { action: '删除了标签', target: '测试标签', time: '1小时前', type: 'delete' },
    { action: '发布了文章', target: 'React 最佳实践', time: '2小时前', type: 'publish' },
    { action: '更新了分类', target: '前端开发', time: '3小时前', type: 'edit' },
  ]

  const quickStats = [
    { label: '今日访问', value: 128, trend: '+12%' },
    { label: '活跃用户', value: 56, trend: '+8%' },
    { label: '新增文章', value: 3, trend: '+50%' },
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
          👋 欢迎回来，管理员
        </Title>
        <Text type="secondary">
          今天是 {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              styles={{
                body: { padding: 20 },
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 14 }}>{stat.title}</Text>
                  <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, marginTop: 4 }}>
                    {stat.value.toLocaleString()}
                  </div>
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 快速统计 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ color: '#52c41a' }} />
                <span>今日概览</span>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
          >
            <List
              dataSource={quickStats}
              renderItem={(item) => (
                <List.Item style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Text>{item.label}</Text>
                    <Space>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{item.value}</span>
                      <Tag color="success" style={{ margin: 0 }}>{item.trend}</Tag>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#1677ff' }} />
                <span>最近活动</span>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: '12px 24px' }}>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text>{item.action}</Text>
                        <Tag color={
                          item.type === 'create' ? 'success' :
                            item.type === 'edit' ? 'processing' :
                              item.type === 'delete' ? 'error' : 'default'
                        }>
                          {item.target}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {item.time}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统状态 */}
      <Card
        title={
          <Space>
            <TeamOutlined style={{ color: '#722ed1' }} />
            <span>系统状态</span>
          </Space>
        }
        style={{ marginTop: 16 }}
      >
        <Row gutter={[32, 16]}>
          <Col xs={24} sm={8}>
            <div style={{ marginBottom: 8 }}>
              <Text>CPU 使用率</Text>
              <Text style={{ float: 'right' }}>45%</Text>
            </div>
            <Progress percent={45} strokeColor="#1677ff" showInfo={false} />
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ marginBottom: 8 }}>
              <Text>内存使用率</Text>
              <Text style={{ float: 'right' }}>62%</Text>
            </div>
            <Progress percent={62} strokeColor="#52c41a" showInfo={false} />
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ marginBottom: 8 }}>
              <Text>磁盘使用率</Text>
              <Text style={{ float: 'right' }}>38%</Text>
            </div>
            <Progress percent={38} strokeColor="#faad14" showInfo={false} />
          </Col>
        </Row>
      </Card>
    </AdminLayout>
  )
}
