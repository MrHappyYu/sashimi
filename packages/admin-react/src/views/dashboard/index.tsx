import { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Table } from 'antd'
import { ShoppingOutlined, CalendarOutlined } from '@ant-design/icons'
import request from '../../utils/request'
import styles from './dashboard.module.less'

export default function Dashboard() {
  const [stats, setStats] = useState({ todayOrders: 0, todayAmount: 0, pendingReservations: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [pendingReservations, setPendingReservations] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingReservations, setLoadingReservations] = useState(false)

  const orderColumns = [
    { title: '订单号', dataIndex: 'orderNo', ellipsis: true },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      render: (text: number) => <span className={styles.amount}>¥{text}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: number) => {
        const map: Record<number, string> = {
          0: '待支付', 1: '已支付', 2: '制作中', 3: '已完成', 4: '已取消',
        }
        return map[text] || '-'
      },
    },
  ]

  const reservationColumns = [
    { title: '日期', dataIndex: 'reservationDate' },
    { title: '时段', dataIndex: 'reservationTime' },
    { title: '人数', dataIndex: 'peopleCount' },
    { title: '联系人', dataIndex: 'contactName' },
  ]

  async function loadStats() {
    try {
      const data: any = await request.get('/admin/stats/overview')
      setStats(data)
    } catch (e) { console.error(e) }
  }

  async function loadOrders() {
    setLoadingOrders(true)
    try {
      const data: any = await request.get('/admin/order/list')
      setRecentOrders((data || []).slice(0, 5))
    } catch (e) { console.error(e) } finally { setLoadingOrders(false) }
  }

  async function loadReservations() {
    setLoadingReservations(true)
    try {
      const data: any = await request.get('/admin/reservation/list', { params: { status: 0 } })
      setPendingReservations(data || [])
    } catch (e) { console.error(e) } finally { setLoadingReservations(false) }
  }

  useEffect(() => {
    loadStats()
    loadOrders()
    loadReservations()
  }, [])

  return (
    <div>
      <div className={styles.pageTitle}>数据概览</div>

      <Row gutter={16} className={styles.statsRow}>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日订单"
              value={stats.todayOrders}
              suffix="单"
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#c9a96e' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日营业额"
              value={stats.todayAmount}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#27ae60' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="待处理预订"
              value={stats.pendingReservations}
              suffix="条"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#e74c3c' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="最近订单" loading={loadingOrders}>
            <Table dataSource={recentOrders} columns={orderColumns} pagination={false} size="small" rowKey="id" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="待确认预订" loading={loadingReservations}>
            <Table dataSource={pendingReservations} columns={reservationColumns} pagination={false} size="small" rowKey="id" />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
