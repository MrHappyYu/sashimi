package com.sashimi.module.auth.entity;

import lombok.Data;

/**
 * 管理员实体 / Admin entity
 */
@Data
public class SmAdmin {
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private Integer status;
}
