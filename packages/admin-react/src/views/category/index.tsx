import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Select, Tag, Popconfirm, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import request from '../../utils/request'
import styles from '../page.module.less'

export default function Category() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '分类名称', dataIndex: 'name' },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, r: any) => (
        <Tag color={r.status === 1 ? 'green' : 'red'}>{r.status === 1 ? '正常' : '禁用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: any, r: any) => (
        <Space>
          <a className={styles.linkGold} onClick={() => openEdit(r)}>编辑</a>
          <Popconfirm title="确认删除？" onConfirm={() => deleteItem(r.id)}>
            <a className={styles.linkDanger}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  async function loadList() {
    setLoading(true)
    try {
      const data: any = await request.get('/admin/category/list')
      setList(data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  function openAdd() {
    setIsEdit(false)
    form.resetFields()
    form.setFieldsValue({ sort: 0, status: 1 })
    setModalOpen(true)
  }

  function openEdit(record: any) {
    setIsEdit(true)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  async function handleSave() {
    const values = await form.validateFields()
    setSaving(true)
    try {
      if (isEdit) {
        await request.put('/admin/category', values)
      } else {
        await request.post('/admin/category', values)
      }
      message.success('保存成功')
      setModalOpen(false)
      loadList()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  async function deleteItem(id: number) {
    try {
      await request.delete(`/admin/category/${id}`)
      message.success('删除成功')
      loadList()
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadList() }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>分类管理</span>
        <Button type="primary" icon={<PlusOutlined />} className={styles.addBtn} onClick={openAdd}>
          新增分类
        </Button>
      </div>

      <Table dataSource={list} columns={columns} loading={loading} rowKey="id" pagination={false} />

      <Modal
        open={modalOpen}
        title={isEdit ? '编辑分类' : '新增分类'}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="分类名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="如：三文鱼系列" />
          </Form.Item>
          <Form.Item label="图标URL" name="icon">
            <Input placeholder="图标链接（可选）" />
          </Form.Item>
          <Form.Item label="排序" name="sort">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select>
              <Select.Option value={1}>正常</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
