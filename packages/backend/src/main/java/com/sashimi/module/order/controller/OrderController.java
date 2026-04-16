package com.sashimi.module.order.controller;

import com.sashimi.common.Result;
import com.sashimi.module.order.dto.CreateOrderRequest;
import com.sashimi.module.order.entity.SmOrder;
import com.sashimi.module.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 订单接口 / Order controller
 */
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** 创建订单 / Create order */
    @PostMapping("/create")
    public Result<SmOrder> create(@Valid @RequestBody CreateOrderRequest req) {
        return Result.success(orderService.create(req));
    }

    /** 我的订单 / My orders */
    @GetMapping("/list")
    public Result<List<SmOrder>> list(@RequestParam(required = false) Integer status) {
        return Result.success(orderService.list(status));
    }

    /** 订单详情 / Order detail */
    @GetMapping("/{id}")
    public Result<SmOrder> detail(@PathVariable Long id) {
        return Result.success(orderService.detail(id));
    }

    /** 取消订单 / Cancel order */
    @PostMapping("/{id}/cancel")
    public Result<?> cancel(@PathVariable Long id) {
        orderService.cancel(id);
        return Result.success();
    }
}
