package com.sashimi.module.auth.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 微信用户实体 / WeChat user entity
 */
@Data
public class SmUser {
    private Long id;
    private String openid;
    private String nickname;
    private String avatarUrl;
    private String phone;
    private LocalDateTime createTime;
}
