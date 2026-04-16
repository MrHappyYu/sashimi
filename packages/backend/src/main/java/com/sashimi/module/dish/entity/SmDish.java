package com.sashimi.module.dish.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 菜品实体 / Dish entity
 */
@Data
public class SmDish {
    private Long id;
    private Long categoryId;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String image;
    private Integer sort;
    private Integer status;
    private Integer isRecommended;
    private LocalDateTime createTime;

    // 关联分类名称 / Category name (joined)
    private String categoryName;
}
