package com.sashimi.module.admin.controller;

import com.sashimi.common.Result;
import com.sashimi.module.order.entity.SmOrder;
import com.sashimi.module.order.service.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 管理端-订单管理 / Admin order management
 */
@RestController
@RequestMapping("/api/admin/order")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderMapper orderMapper;

    @GetMapping("/list")
    public Result<List<SmOrder>> list(@RequestParam(required = false) Integer status) {
        List<SmOrder> orders = orderMapper.listAdmin(status);
        orders.forEach(o -> o.setItems(orderMapper.findItemsByOrderId(o.getId())));
        return Result.success(orders);
    }

    @PutMapping("/{id}/status")
    public Result<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        orderMapper.updateStatusAdmin(id, body.get("status"));
        return Result.success();
    }
}
