import { useState, useEffect } from 'react'
import { Table, Tag, Select, Radio, message } from 'antd'
import request from '../../utils/request'
import styles from '../page.module.less'

const statusMap: Record<number, string> = {
  0: '待支付', 1: '已支付', 2: '制作中', 3: '已完成', 4: '已取消',
}
const colorMap: Record<number, string> = {
  0: 'orange', 1: 'cyan', 2: 'blue', 3: 'green', 4: 'default',
}

export default function Order() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState<number | null>(null)

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 200, ellipsis: true },
    {
      title: '金额',
      key: 'totalAmount',
      width: 120,
      render: (_: any, r: any) => (
        <span className={styles.priceHighlight}>¥{r.totalAmount}</span>
      ),
    },
    {
      title: '用餐方式',
      key: 'orderType',
      width: 100,
      render: (_: any, r: any) => (r.orderType === 1 ? '堂食' : '外带'),
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      width: 170,
      render: (text: string) => text?.replace('T', ' ').substring(0, 16),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, r: any) => (
        <Tag color={colorMap[r.status]}>{statusMap[r.status] || '-'}</Tag>
      ),
    },
    {
      title: '更新状态',
      key: 'action',
      width: 130,
      render: (_: any, r: any) => (
        <Select
          value={r.status}
          style={{ width: 110 }}
          size="small"
          onChange={(val: number) => updateStatus(r.id, val)}
        >
          {Object.entries(statusMap).map(([k, v]) => (
            <Select.Option key={k} value={Number(k)}>{v}</Select.Option>
          ))}
        </Select>
      ),
    },
  ]

  async function loadList() {
    setLoading(true)
    try {
      const data: any = await request.get('/admin/order/list', {
        params: filterStatus != null ? { status: filterStatus } : {},
      })
      setList(data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: number) {
    try {
      await request.put(`/admin/order/${id}/status`, { status })
      message.success('状态已更新')
      loadList()
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadList() }, [filterStatus])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>订单管理</span>
      </div>

      <Radio.Group
        value={filterStatus}
        buttonStyle="solid"
        className={styles.filterBar}
        onChange={e => setFilterStatus(e.target.value)}
      >
        <Radio.Button value={null}>全部</Radio.Button>
        <Radio.Button value={0}>待支付</Radio.Button>
        <Radio.Button value={1}>已支付</Radio.Button>
        <Radio.Button value={2}>制作中</Radio.Button>
        <Radio.Button value={3}>已完成</Radio.Button>
        <Radio.Button value={4}>已取消</Radio.Button>
      </Radio.Group>

      <Table
        dataSource={list}
        columns={columns}
        loading={loading}
        rowKey="id"
        expandable={{
          expandedRowRender: (record: any) => (
            <div>
              {(record.items || []).map((item: any) => (
                <div key={item.id}>
                  {item.dishName} × {item.quantity} — ¥{item.subtotal}
                </div>
              ))}
            </div>
          ),
        }}
      />
    </div>
  )
}
