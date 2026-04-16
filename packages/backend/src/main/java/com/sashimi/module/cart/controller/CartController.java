package com.sashimi.module.cart.controller;

import com.sashimi.common.Result;
import com.sashimi.module.cart.entity.SmCart;
import com.sashimi.module.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 购物车接口 / Cart controller
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/list")
    public Result<List<SmCart>> list() {
        return Result.success(cartService.list());
    }

    @PostMapping("/add")
    public Result<?> add(@RequestBody Map<String, Object> body) {
        Long dishId = Long.valueOf(body.get("dishId").toString());
        Integer quantity = body.containsKey("quantity") ? Integer.valueOf(body.get("quantity").toString()) : 1;
        cartService.add(dishId, quantity);
        return Result.success();
    }

    @PutMapping("/update")
    public Result<?> update(@RequestBody Map<String, Object> body) {
        Long cartId = Long.valueOf(body.get("id").toString());
        Integer quantity = Integer.valueOf(body.get("quantity").toString());
        cartService.update(cartId, quantity);
        return Result.success();
    }

    @DeleteMapping("/remove/{id}")
    public Result<?> remove(@PathVariable Long id) {
        cartService.remove(id);
        return Result.success();
    }

    @DeleteMapping("/clear")
    public Result<?> clear() {
        cartService.clear();
        return Result.success();
    }
}
