import { useState, useEffect, useCallback,memo } from 'react'
import {
  Table, Button, Modal, Form, Input, InputNumber, Select, Tag,
  Popconfirm, Space, message, Row, Col
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import request from '../../utils/request'
import styles from '../page.module.less'

export default function Dish() {
  const [list, setList] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [filterCategoryId, setFilterCategoryId] = useState<number | undefined>()
  const [filterKeyword, setFilterKeyword] = useState('')
  const [form] = Form.useForm()

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '菜品名称', dataIndex: 'name' },
    { title: '分类', dataIndex: 'categoryName', width: 120 },
    {
      title: '价格',
      key: 'price',
      width: 150,
      render: (_: any, r: any) => (
        <>
          <span className={styles.priceHighlight}>¥{r.price}</span>
          {r.originalPrice && (
            <span className={styles.priceOriginal}>¥{r.originalPrice}</span>
          )}
        </>
      ),
    },
    {
      title: '推荐',
      key: 'isRecommended',
      width: 80,
      render: (_: any, r: any) =>
        r.isRecommended === 1
          ? <Tag color="gold">推荐</Tag>
          : <span className={styles.placeholder}>-</span>,
    },
    {
      title: '状态',
      key: 'status',
      width: 90,
      render: (_: any, r: any) => (
        <Tag color={r.status === 1 ? 'green' : 'default'}>{r.status === 1 ? '上架' : '下架'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, r: any) => (
        <Space>
          <a className={styles.linkGold} onClick={() => openEdit(r)}>编辑</a>
          <Popconfirm title="确认删除该菜品？" onConfirm={() => deleteItem(r.id)}>
            <a className={styles.linkDanger}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  async function loadCategories() {
    try {
      const data: any = await request.get('/admin/category/list')
      setCategories(data)
    } catch (e) { console.error(e) }
  }

  async function loadList() {
    setLoading(true)
    try {
      const data: any = await request.get('/admin/dish/list', {
        params: { categoryId: filterCategoryId, keyword: filterKeyword || undefined },
      })
      setList(data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  function openAdd() {
    setIsEdit(false)
    form.resetFields()
    form.setFieldsValue({ sort: 0, status: 1, isRecommended: 0 })
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
        await request.put('/admin/dish', values)
      } else {
        await request.post('/admin/dish', values)
      }
      message.success('保存成功')
      setModalOpen(false)
      loadList()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  async function deleteItem(id: number) {
    try {
      await request.delete(`/admin/dish/${id}`)
      message.success('删除成功')
      loadList()
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    loadCategories()
    loadList()
  }, [])
  const Parent = () => {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    console.log('click')
  }, [])  // 函数引用稳定

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+1 </button>
      <span>count:{count}</span>
      <Child onClick={handleClick} />  {/* props 没变，memo 生效 */}
    </>
  )
}

const Child = memo(({ onClick }) => {
  console.log('Child 渲染了')
  return <button onClick={onClick}>点我</button>
})
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>菜品管理</span><Parent />
        <Button type="primary" icon={<PlusOutlined />} className={styles.addBtn} onClick={openAdd}>
          新增菜品
        </Button>
      </div>

      <Space className={styles.filterBar}>
        <Select
          value={filterCategoryId}
          placeholder="分类筛选"
          style={{ width: 150 }}
          allowClear
          onChange={(val) => { setFilterCategoryId(val); loadList() }}
        >
          {categories.map((c: any) => (
            <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
          ))}
        </Select>
        <Input.Search
          value={filterKeyword}
          placeholder="搜索菜品名"
          style={{ width: 200 }}
          onChange={e => setFilterKeyword(e.target.value)}
          onSearch={loadList}
        />
      </Space>

      <Table
        dataSource={list}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={modalOpen}
        title={isEdit ? '编辑菜品' : '新增菜品'}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="菜品名称" name="name" rules={[{ required: true, message: '请输入菜品名称' }]}>
                <Input placeholder="如：挪威三文鱼刺身" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="所属分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
                <Select placeholder="选择分类">
                  {categories.map((c: any) => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="菜品描述" name="description">
            <Input.TextArea placeholder="描述菜品特点、份量等" rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="售价(¥)" name="price" rules={[{ required: true, message: '请输入售价' }]}>
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="原价(¥，可选)" name="originalPrice">
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="图片URL（可选）" name="image">
            <Input placeholder="菜品图片链接" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="排序" name="sort">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="上架状态" name="status">
                <Select>
                  <Select.Option value={1}>上架</Select.Option>
                  <Select.Option value={0}>下架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="是否推荐" name="isRecommended">
                <Select>
                  <Select.Option value={1}>推荐</Select.Option>
                  <Select.Option value={0}>不推荐</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
