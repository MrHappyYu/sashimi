package com.sashimi.module.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 微信登录请求 / WeChat login request
 */
@Data
public class WxLoginRequest {
    @NotBlank(message = "code不能为空")
    private String code;      // 微信登录 code
    private String nickname;  // 用户昵称 (可选，前端传入)
    private String avatarUrl; // 用户头像 (可选)
}
