package com.sashimi.module.dish.controller;

import com.sashimi.common.Result;
import com.sashimi.module.dish.entity.SmCategory;
import com.sashimi.module.dish.service.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类接口 / Category controller
 */
@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryMapper categoryMapper;

    /** 公开接口：获取所有启用分类 / Public: get active categories */
    @GetMapping("/list")
    public Result<List<SmCategory>> list() {
        return Result.success(categoryMapper.listActive());
    }
}
