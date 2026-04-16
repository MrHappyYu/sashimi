package com.sashimi.module.admin.controller;

import com.sashimi.common.Result;
import com.sashimi.module.dish.entity.SmCategory;
import com.sashimi.module.dish.service.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 管理端-分类管理 / Admin category management
 */
@RestController
@RequestMapping("/api/admin/category")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryMapper categoryMapper;

    @GetMapping("/list")
    public Result<List<SmCategory>> list() {
        return Result.success(categoryMapper.listAll());
    }

    @PostMapping
    public Result<?> add(@RequestBody SmCategory category) {
        category.setStatus(1);
        categoryMapper.insert(category);
        return Result.success(category);
    }

    @PutMapping
    public Result<?> update(@RequestBody SmCategory category) {
        categoryMapper.update(category);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        categoryMapper.delete(id);
        return Result.success();
    }
}
