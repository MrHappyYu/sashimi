package com.sashimi.module.order.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

/**
 * 创建订单请求 / Create order request
 */
@Data
public class CreateOrderRequest {
    @NotEmpty(message = "购物车不能为空")
    private List<Long> cartIds;      // 购物车ID列表
    private Integer orderType = 1;   // 1堂食 2外带
    private Long reservationId;      // 关联预订ID (可选)
    private String remark;           // 备注
}
