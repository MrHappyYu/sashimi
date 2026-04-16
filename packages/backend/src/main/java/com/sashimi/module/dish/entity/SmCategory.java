package com.sashimi.module.dish.entity;

import lombok.Data;

/**
 * 菜品分类实体 / Dish category entity
 */
@Data
public class SmCategory {
    private Long id;
    private String name;
    private String icon;
    private Integer sort;
    private Integer status;
}
