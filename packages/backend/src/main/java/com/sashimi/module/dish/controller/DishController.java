package com.sashimi.module.dish.controller;

import com.sashimi.common.Result;
import com.sashimi.module.dish.entity.SmDish;
import com.sashimi.module.dish.service.DishMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜品接口 / Dish controller
 */
@RestController
@RequestMapping("/api/dish")
@RequiredArgsConstructor
public class DishController {

    private final DishMapper dishMapper;

    /** 菜品列表 / Dish list */
    @GetMapping("/list")
    public Result<List<SmDish>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {
        return Result.success(dishMapper.list(categoryId, keyword));
    }

    /** 菜品详情 / Dish detail */
    @GetMapping("/{id}")
    public Result<SmDish> detail(@PathVariable Long id) {
        SmDish dish = dishMapper.findById(id);
        if (dish == null) return Result.error("菜品不存在");
        return Result.success(dish);
    }

    /** 推荐菜品 / Recommended dishes */
    @GetMapping("/recommended")
    public Result<List<SmDish>> recommended() {
        return Result.success(dishMapper.listRecommended());
    }
}
