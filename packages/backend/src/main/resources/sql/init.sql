-- 刺身点单预订系统数据库初始化脚本
-- Sashimi ordering system database initialization

CREATE DATABASE IF NOT EXISTS sashimi_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sashimi_db;

-- 微信用户表 / WeChat user table
CREATE TABLE IF NOT EXISTS sm_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(100) UNIQUE NOT NULL COMMENT '微信 openid',
  nickname VARCHAR(50) COMMENT '昵称',
  avatar_url VARCHAR(500) COMMENT '头像URL',
  phone VARCHAR(20) COMMENT '手机号',
  create_time DATETIME DEFAULT NOW() COMMENT '创建时间'
) COMMENT '微信用户表';

-- 管理员表 / Admin table
CREATE TABLE IF NOT EXISTS sm_admin (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  password VARCHAR(100) NOT NULL COMMENT '密码(BCrypt)',
  nickname VARCHAR(50) COMMENT '昵称',
  status TINYINT DEFAULT 1 COMMENT '状态 1正常 0禁用'
) COMMENT '管理员表';

-- 菜品分类 / Dish category
CREATE TABLE IF NOT EXISTS sm_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(200) COMMENT '分类图标URL',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1正常 0禁用'
) COMMENT '菜品分类';

-- 菜品 / Dish
CREATE TABLE IF NOT EXISTS sm_dish (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT NOT NULL COMMENT '分类ID',
  name VARCHAR(100) NOT NULL COMMENT '菜品名称',
  description VARCHAR(500) COMMENT '描述',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  original_price DECIMAL(10,2) COMMENT '原价',
  image VARCHAR(500) COMMENT '图片URL',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1上架 0下架',
  is_recommended TINYINT DEFAULT 0 COMMENT '是否推荐 1是 0否',
  create_time DATETIME DEFAULT NOW() COMMENT '创建时间'
) COMMENT '菜品表';

-- 购物车 / Shopping cart
CREATE TABLE IF NOT EXISTS sm_cart (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT '用户ID',
  dish_id BIGINT NOT NULL COMMENT '菜品ID',
  dish_name VARCHAR(100) COMMENT '菜品名称(冗余)',
  dish_image VARCHAR(500) COMMENT '菜品图片(冗余)',
  price DECIMAL(10,2) COMMENT '单价(冗余)',
  quantity INT DEFAULT 1 COMMENT '数量',
  update_time DATETIME DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
  UNIQUE KEY uk_user_dish (user_id, dish_id)
) COMMENT '购物车';

-- 预订表 / Reservation
CREATE TABLE IF NOT EXISTS sm_reservation (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT '用户ID',
  reservation_date DATE NOT NULL COMMENT '预订日期',
  reservation_time VARCHAR(10) NOT NULL COMMENT '预订时间段',
  people_count INT NOT NULL COMMENT '用餐人数',
  contact_name VARCHAR(50) NOT NULL COMMENT '联系人姓名',
  contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
  remark VARCHAR(500) COMMENT '备注',
  status TINYINT DEFAULT 0 COMMENT '状态 0待确认 1已确认 2已取消 3已完成',
  create_time DATETIME DEFAULT NOW() COMMENT '创建时间'
) COMMENT '预订表';

-- 订单主表 / Order
CREATE TABLE IF NOT EXISTS sm_order (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(30) UNIQUE NOT NULL COMMENT '订单号',
  user_id BIGINT NOT NULL COMMENT '用户ID',
  order_type TINYINT DEFAULT 1 COMMENT '订单类型 1堂食 2外带',
  reservation_id BIGINT COMMENT '关联预订ID',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '总金额',
  status TINYINT DEFAULT 0 COMMENT '状态 0待支付 1已支付 2制作中 3已完成 4已取消',
  pay_type TINYINT COMMENT '支付方式 1微信支付',
  pay_time DATETIME COMMENT '支付时间',
  remark VARCHAR(500) COMMENT '备注',
  create_time DATETIME DEFAULT NOW() COMMENT '创建时间'
) COMMENT '订单表';

-- 订单明细 / Order items
CREATE TABLE IF NOT EXISTS sm_order_item (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL COMMENT '订单ID',
  dish_id BIGINT NOT NULL COMMENT '菜品ID',
  dish_name VARCHAR(100) NOT NULL COMMENT '菜品名称',
  dish_image VARCHAR(500) COMMENT '菜品图片',
  price DECIMAL(10,2) NOT NULL COMMENT '单价',
  quantity INT NOT NULL COMMENT '数量',
  subtotal DECIMAL(10,2) NOT NULL COMMENT '小计'
) COMMENT '订单明细';

-- ========== 初始数据 / Initial Data ==========

-- 管理员 admin/admin123
INSERT IGNORE INTO sm_admin (username, password, nickname) VALUES
('admin', '$2b$10$RZTYmDOPs7zzT7cUB.KnBeHhyhKvzUsU/139X8JCo1.UA4nAgISsO', '超级管理员');  -- 密码: admin123

-- 菜品分类
INSERT IGNORE INTO sm_category (id, name, sort) VALUES
(1, '三文鱼系列', 1),
(2, '金枪鱼系列', 2),
(3, '精选刺身', 3),
(4, '套餐组合', 4);

-- 菜品示例数据
INSERT IGNORE INTO sm_dish (id, category_id, name, description, price, original_price, sort, status, is_recommended) VALUES
(1, 1, '挪威三文鱼刺身', '精选挪威进口三文鱼，肉质鲜嫩，脂肪均匀，口感丰腴。5片装。', 58.00, 68.00, 1, 1, 1),
(2, 1, '三文鱼腹刺身', '三文鱼腹部最肥美的部位，入口即化，脂香四溢。5片装。', 78.00, 88.00, 2, 1, 1),
(3, 1, '炙烤三文鱼刺身', '表面轻微炙烤，外香内嫩，口感层次丰富。5片装。', 68.00, NULL, 3, 1, 0),
(4, 1, '三文鱼大头刺身', '新鲜三文鱼头部精华，胶原蛋白丰富。', 88.00, NULL, 4, 1, 0),
(5, 2, '蓝鳍金枪鱼赤身', '顶级蓝鳍金枪鱼赤身部位，纯粹海洋鲜味，肉质细腻。5片装。', 128.00, 158.00, 1, 1, 1),
(6, 2, '金枪鱼中腹刺身', '金枪鱼中腹部位，肥瘦均匀，鲜甜可口。5片装。', 98.00, NULL, 2, 1, 0),
(7, 2, '金枪鱼大腹刺身', '顶级大腹部位，油脂丰富，入口即化。3片装。', 168.00, 198.00, 3, 1, 1),
(8, 2, '炙烤金枪鱼腹', '金枪鱼腹部炙烤处理，焦香与鲜甜完美融合。5片装。', 108.00, NULL, 4, 1, 0),
(9, 3, '北海道帆立贝', '新鲜北海道带子，肉质饱满，甜润清甜。3粒装。', 88.00, NULL, 1, 1, 1),
(10, 3, '甜虾刺身', '北极甜虾，天然甜味，口感弹牙。8只装。', 68.00, 78.00, 2, 1, 0),
(11, 3, '牡丹虾刺身', '顶级牡丹虾，肉质饱满，甜度极高。4只装。', 108.00, NULL, 3, 1, 1),
(12, 3, '鱿鱼刺身', '新鲜鱿鱼切片，爽脆弹牙，海鲜风味浓郁。5片装。', 48.00, NULL, 4, 1, 0),
(13, 3, '章鱼刺身', '精选章鱼腿部，口感爽脆，带有淡淡甜味。5片装。', 58.00, NULL, 5, 1, 0),
(14, 4, '双人刺身豪华套餐', '三文鱼×5、金枪鱼×4、帆立贝×2、甜虾×4、鱿鱼×3，适合双人享用。', 238.00, 298.00, 1, 1, 1),
(15, 4, '四人刺身盛合', '多种精选刺身，丰盛搭配，适合4人聚餐享用。', 428.00, 528.00, 2, 1, 1),
(16, 4, '入门刺身套餐', '三文鱼×3、金枪鱼×2、甜虾×4，适合初次体验者。', 128.00, 158.00, 3, 1, 0);
