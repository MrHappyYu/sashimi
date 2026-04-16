package com.sashimi.module.order.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单实体 / Order entity
 */
@Data
public class SmOrder {
    private Long id;
    private String orderNo;
    private Long userId;
    private Integer orderType;       // 1堂食 2外带
    private Long reservationId;
    private BigDecimal totalAmount;
    private Integer status;          // 0待支付 1已支付 2制作中 3已完成 4已取消
    private Integer payType;
    private LocalDateTime payTime;
    private String remark;
    private LocalDateTime createTime;

    // 关联明细 / Order items (joined)
    private List<SmOrderItem> items;
}
