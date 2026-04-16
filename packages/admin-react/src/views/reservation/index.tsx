import { useState, useEffect } from 'react'
import { Table, Tag, Radio, DatePicker, Space, Button, message } from 'antd'
import dayjs from 'dayjs'
import request from '../../utils/request'
import styles from '../page.module.less'

const statusText = (s: number) => ['待确认', '已确认', '已取消', '已完成'][s] || '-'
const statusColor: Record<number, string> = { 0: 'orange', 1: 'green', 2: 'default', 3: 'blue' }

export default function Reservation() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState<number | null>(null)
  const [filterDate, setFilterDate] = useState<any>(null)

  const columns = [
    {
      title: '预订日期/时段',
      key: 'dateTime',
      width: 130,
      render: (_: any, r: any) => (
        <>
          <div>{r.reservationDate}</div>
          <div className={styles.subText}>{r.reservationTime}</div>
        </>
      ),
    },
    { title: '人数', dataIndex: 'peopleCount', width: 70 },
    {
      title: '联系人',
      key: 'contact',
      width: 130,
      render: (_: any, r: any) => (
        <>
          <div>{r.contactName}</div>
          <div className={styles.subText}>{r.contactPhone}</div>
        </>
      ),
    },
    { title: '备注', dataIndex: 'remark', ellipsis: true },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      width: 160,
      render: (text: string) => text?.replace('T', ' ').substring(0, 16),
    },
    {
      title: '状态',
      key: 'status',
      width: 90,
      render: (_: any, r: any) => (
        <Tag color={statusColor[r.status]}>{statusText(r.status)}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, r: any) => {
        if (r.status === 0) {
          return (
            <Space>
              <Button type="primary" size="small" className={styles.confirmBtn} onClick={() => updateStatus(r.id, 1)}>
                确认
              </Button>
              <Button danger size="small" onClick={() => updateStatus(r.id, 2)}>取消</Button>
            </Space>
          )
        }
        if (r.status === 1) {
          return <Button size="small" onClick={() => updateStatus(r.id, 3)}>标记完成</Button>
        }
        return <span className={styles.placeholder}>-</span>
      },
    },
  ]

  async function loadList() {
    setLoading(true)
    const params: any = {}
    if (filterStatus != null) params.status = filterStatus
    if (filterDate) params.date = dayjs(filterDate).format('YYYY-MM-DD')
    try {
      const data: any = await request.get('/admin/reservation/list', { params })
      setList(data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  async function updateStatus(id: number, status: number) {
    try {
      await request.put(`/admin/reservation/${id}/status`, { status })
      message.success('状态已更新')
      loadList()
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadList() }, [filterStatus, filterDate])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>预订管理</span>
      </div>

      <Space className={styles.filterBar}>
        <Radio.Group
          value={filterStatus}
          buttonStyle="solid"
          onChange={e => setFilterStatus(e.target.value)}
        >
          <Radio.Button value={null}>全部</Radio.Button>
          <Radio.Button value={0}>待确认</Radio.Button>
          <Radio.Button value={1}>已确认</Radio.Button>
          <Radio.Button value={2}>已取消</Radio.Button>
          <Radio.Button value={3}>已完成</Radio.Button>
        </Radio.Group>
        <DatePicker value={filterDate} onChange={setFilterDate} placeholder="按日期筛选" />
      </Space>

      <Table dataSource={list} columns={columns} loading={loading} rowKey="id" />
    </div>
  )
}
