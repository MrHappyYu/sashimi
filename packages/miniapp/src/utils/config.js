/**
 * 应用配置 / App configuration
 * 部署前请修改以下配置 / Please update the following configurations before deployment
 */
export const config = {
  // 后端 API 地址 / Backend API URL
  // 开发环境直接访问，生产环境配置域名
  baseUrl: 'http://192.168.2.4:8081',

  // ========== 微信小程序配置 (需自行填写) / WeChat Mini-Program Config ==========
  wxAppId: 'YOUR_WX_APP_ID',      // 在微信公众平台获取 / Get from WeChat Open Platform

  // 微信支付配置 (可选) / WeChat Pay config (optional)
  wxPay: {
    mchId: 'YOUR_MCH_ID',         // 商户号 / Merchant ID
    notifyUrl: 'https://your-domain.com/api/order/pay-notify'
  }
  // ============================================================================
}
