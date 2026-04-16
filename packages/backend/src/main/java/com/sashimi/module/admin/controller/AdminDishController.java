package com.sashimi.module.admin.controller;

import com.sashimi.common.Result;
import com.sashimi.module.dish.entity.SmDish;
import com.sashimi.module.dish.service.DishMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 管理端-菜品管理 / Admin dish management
 */
@RestController
@RequestMapping("/api/admin/dish")
@RequiredArgsConstructor
public class AdminDishController {

    private final DishMapper dishMapper;

    @GetMapping("/list")
    public Result<List<SmDish>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status) {
        return Result.success(dishMapper.listAdmin(categoryId, keyword, status));
    }

    @PostMapping
    public Result<?> add(@RequestBody SmDish dish) {
        if (dish.getStatus() == null) dish.setStatus(1);
        if (dish.getIsRecommended() == null) dish.setIsRecommended(0);
        dishMapper.insert(dish);
        return Result.success(dish);
    }

    @PutMapping
    public Result<?> update(@RequestBody SmDish dish) {
        dishMapper.update(dish);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        dishMapper.delete(id);
        return Result.success();
    }
}
