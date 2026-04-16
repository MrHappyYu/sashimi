import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '../store'
import { toggleCollapsed } from '../store/slices/appSlice'
import { logout } from '../store/slices/userSlice'
import { announce } from '../store/slices/notificationSlice'
import styles from './Layout.module.less'

const { Sider, Header, Content } = Layout

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '数据概览' },
  { key: 'category', icon: <AppstoreOutlined />, label: '分类管理' },
  { key: 'dish', icon: <ShoppingOutlined />, label: '菜品管理' },
  { key: 'order', icon: <OrderedListOutlined />, label: '订单管理' },
  { key: 'reservation', icon: <CalendarOutlined />, label: '预订管理' },
]

export default function AppLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const collapsed = useAppSelector(s => s.app.collapsed)
  const orderArr = useAppSelector(s => s.notification.orderArr)
  const hasNewOrder = orderArr.filter(o => o.orderStatus === '0').length > 0

  const selectedKey = location.pathname.split('/')[1] || 'dashboard'

  function handleMenuClick({ key }: { key: string }) {
    navigate('/' + key)
  }

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  function testBell() {
    dispatch(
      announce({
        id: String(Date.now()),
        orderName: '测试订单',
        orderContent: '三文鱼刺身 x1',
        orderStatus: '0',
        orderTime: new Date().toISOString(),
        link: '/order',
      })
    )
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        collapsed={collapsed}
        trigger={null}
        collapsible
        width={200}
        className={styles.sider}
      >
        <div className={styles.logo}>
          {collapsed ? '🐟' : '🐟 刺身管理'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.menu}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          {collapsed ? (
            <MenuUnfoldOutlined onClick={() => dispatch(toggleCollapsed())} />
          ) : (
            <MenuFoldOutlined onClick={() => dispatch(toggleCollapsed())} />
          )}
          <div className={styles.headerRight}>
            <span className={styles.bell} onClick={testBell}>
              <BellOutlined className={hasNewOrder ? styles.bellRinging : ''} />
            </span>
            <span className={styles.adminName}>管理员</span>
            <Button type="link" danger onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
