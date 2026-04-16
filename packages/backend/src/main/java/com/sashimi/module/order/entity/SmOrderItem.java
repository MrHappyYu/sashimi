package com.sashimi.module.order.entity;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 订单明细实体 / Order item entity
 */
@Data
public class SmOrderItem {
    private Long id;
    private Long orderId;
    private Long dishId;
    private String dishName;
    private String dishImage;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
}
