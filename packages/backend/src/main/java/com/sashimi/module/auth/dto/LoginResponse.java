package com.sashimi.module.auth.dto;

import lombok.Builder;
import lombok.Data;

/**
 * 登录响应 / Login response
 */
@Data
@Builder
public class LoginResponse {
    private String token;
    private String role;       // "user" or "admin"
    private Long userId;
    private String nickname;
    private String avatarUrl;
}
