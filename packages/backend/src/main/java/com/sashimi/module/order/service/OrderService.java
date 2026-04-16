package com.sashimi.module.order.service;

import com.sashimi.common.BusinessException;
import com.sashimi.module.cart.entity.SmCart;
import com.sashimi.module.cart.service.CartMapper;
import com.sashimi.module.order.dto.CreateOrderRequest;
import com.sashimi.module.order.entity.SmOrder;
import com.sashimi.module.order.entity.SmOrderItem;
import com.sashimi.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * 订单服务 / Order service
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final CartMapper cartMapper;

    @Transactional
    public SmOrder create(CreateOrderRequest req) {
        Long userId = SecurityUtil.getCurrentUserId();
        List<SmCart> cartItems = cartMapper.listByUser(userId).stream()
                .filter(c -> req.getCartIds().contains(c.getId()))
                .collect(Collectors.toList());
        if (cartItems.isEmpty()) throw new BusinessException("购物车商品不存在");

        // 计算总金额 / Calculate total
        BigDecimal total = cartItems.stream()
                .map(c -> c.getPrice().multiply(BigDecimal.valueOf(c.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 生成订单号 / Generate order number
        String orderNo = "SM" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + ThreadLocalRandom.current().nextInt(1000, 9999);

        SmOrder order = new SmOrder();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setOrderType(req.getOrderType());
        order.setReservationId(req.getReservationId());
        order.setTotalAmount(total);
        order.setRemark(req.getRemark());
        orderMapper.insertOrder(order);

        // 创建订单明细 / Create order items
        List<SmOrderItem> items = cartItems.stream().map(c -> {
            SmOrderItem item = new SmOrderItem();
            item.setOrderId(order.getId());
            item.setDishId(c.getDishId());
            item.setDishName(c.getDishName());
            item.setDishImage(c.getDishImage());
            item.setPrice(c.getPrice());
            item.setQuantity(c.getQuantity());
            item.setSubtotal(c.getPrice().multiply(BigDecimal.valueOf(c.getQuantity())));
            return item;
        }).collect(Collectors.toList());
        orderMapper.insertItems(items);

        // 清除已购购物车 / Remove purchased cart items
        cartMapper.deleteByDishIds(userId, cartItems.stream().map(SmCart::getDishId).collect(Collectors.toList()));

        order.setItems(items);
        return order;
    }

    public List<SmOrder> list(Integer status) {
        Long userId = SecurityUtil.getCurrentUserId();
        List<SmOrder> orders = orderMapper.listByUser(userId, status);
        orders.forEach(o -> o.setItems(orderMapper.findItemsByOrderId(o.getId())));
        return orders;
    }

    public SmOrder detail(Long id) {
        SmOrder order = orderMapper.findById(id);
        if (order == null) throw new BusinessException("订单不存在");
        if (!order.getUserId().equals(SecurityUtil.getCurrentUserId())) {
            throw new BusinessException(403, "无权查看此订单");
        }
        order.setItems(orderMapper.findItemsByOrderId(id));
        return order;
    }

    public void cancel(Long id) {
        SmOrder order = orderMapper.findById(id);
        if (order == null) throw new BusinessException("订单不存在");
        if (order.getStatus() != 0) throw new BusinessException("只有待支付订单可以取消");
        orderMapper.updateStatus(id, SecurityUtil.getCurrentUserId(), 4);
    }
}
