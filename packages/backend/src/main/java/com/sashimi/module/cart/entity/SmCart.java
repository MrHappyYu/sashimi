package com.sashimi.module.cart.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 购物车实体 / Cart entity
 */
@Data
public class SmCart {
    private Long id;
    private Long userId;
    private Long dishId;
    private String dishName;
    private String dishImage;
    private BigDecimal price;
    private Integer quantity;
    private LocalDateTime updateTime;
}
