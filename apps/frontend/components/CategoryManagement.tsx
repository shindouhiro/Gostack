'use client'

import { useState } from 'react'
import {
  Table, Button, Space, Modal, Form, Input, InputNumber,
  Popconfirm, Card, Tag, Tooltip, Select, Empty
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ReloadOutlined, SearchOutlined, FolderOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useCategories, useCategoryActions, getParentCategoryName } from '@/hooks/useCategory'
import type { Category, CreateCategoryParams } from '@/api/category'

export default function CategoryManagement() {
  const { categories, loading, refresh } = useCategories()
  const { createCategory, updateCategory, deleteCategory, loading: actionLoading } = useCategoryActions()

  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  // 新增
  const handleAdd = () => {
    setEditingCategory(null)
    form.resetFields()
    form.setFieldsValue({ ParentId: 0, Order: 0 })
    setModalVisible(true)
  }

  // 编辑
  const handleEdit = (record: Category) => {
    setEditingCategory(record)
    form.setFieldsValue({
      Name: record.Name,
      ParentId: record.ParentId,
      Order: record.Order,
    })
    setModalVisible(true)
  }

  // 删除
  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id)
      refresh()
    } catch (error) {
      // 错误已在 hook 中处理
    }
  }

  // 提交表单
  const handleSubmit = async (values: CreateCategoryParams) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.Id, values)
      } else {
        await createCategory(values)
      }
      setModalVisible(false)
      refresh()
    } catch (error) {
      // 错误已在 hook 中处理
    }
  }

  // 搜索过滤
  const filteredCategories = categories.filter(c =>
    c.Name.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id',
      width: 80,
      sorter: (a, b) => a.Id - b.Id,
    },
    {
      title: '分类名称',
      dataIndex: 'Name',
      key: 'Name',
      render: (text) => (
        <Space>
          <FolderOutlined style={{ color: '#1677ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '父级分类',
      dataIndex: 'ParentId',
      key: 'ParentId',
      width: 150,
      render: (parentId) => (
        parentId === 0
          ? <Tag color="default">顶级分类</Tag>
          : <Tag color="blue">{getParentCategoryName(categories, parentId)}</Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'Order',
      key: 'Order',
      width: 100,
      sorter: (a, b) => a.Order - b.Order,
      render: (order) => (
        <Tag color="geekblue">{order}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Tooltip>
          <Popconfirm
            title="删除确认"
            description="确定要删除这个分类吗？"
            onConfirm={() => handleDelete(record.Id)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="删除">
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title={
        <Space>
          <AppstoreOutlined style={{ fontSize: 20, color: '#1677ff' }} />
          <span style={{ fontSize: 18, fontWeight: 600 }}>分类管理</span>
        </Space>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索分类..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Tooltip title="刷新">
            <Button
              icon={<ReloadOutlined />}
              onClick={refresh}
              loading={loading}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增分类
          </Button>
        </Space>
      }
      styles={{
        header: {
          borderBottom: '1px solid #f0f0f0',
        },
        body: {
          padding: 0,
        },
      }}
    >
      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="Id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无分类数据"
            >
              <Button type="primary" onClick={handleAdd}>
                立即创建
              </Button>
            </Empty>
          ),
        }}
        style={{ margin: 0 }}
      />

      <Modal
        title={
          <Space>
            {editingCategory ? <EditOutlined /> : <PlusOutlined />}
            {editingCategory ? '编辑分类' : '新增分类'}
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText={editingCategory ? '保存' : '创建'}
        cancelText="取消"
        confirmLoading={actionLoading}
        destroyOnClose
        width={480}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="分类名称"
            name="Name"
            rules={[
              { required: true, message: '请输入分类名称' },
              { max: 50, message: '分类名称不能超过50个字符' },
            ]}
          >
            <Input
              placeholder="请输入分类名称"
              prefix={<FolderOutlined />}
              maxLength={50}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="父级分类"
            name="ParentId"
            initialValue={0}
          >
            <Select
              placeholder="选择父级分类"
              allowClear
              options={[
                { value: 0, label: '顶级分类' },
                ...categories
                  .filter(c => c.Id !== editingCategory?.Id)
                  .map(c => ({ value: c.Id, label: c.Name })),
              ]}
            />
          </Form.Item>

          <Form.Item
            label="排序"
            name="Order"
            initialValue={0}
            tooltip="数值越小越靠前"
          >
            <InputNumber
              min={0}
              max={999}
              placeholder="请输入排序值"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
