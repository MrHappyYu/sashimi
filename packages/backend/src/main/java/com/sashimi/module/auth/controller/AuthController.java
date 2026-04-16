package com.sashimi.module.auth.controller;

import com.sashimi.common.Result;
import com.sashimi.module.auth.dto.AdminLoginRequest;
import com.sashimi.module.auth.dto.LoginResponse;
import com.sashimi.module.auth.dto.WxLoginRequest;
import com.sashimi.module.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 认证接口 / Auth controller
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** 微信小程序登录 / WeChat login */
    @PostMapping("/wx-login")
    public Result<LoginResponse> wxLogin(@Valid @RequestBody WxLoginRequest req) {
        return Result.success(authService.wxLogin(req));
    }

    /** 管理员登录 / Admin login */
    @PostMapping("/admin-login")
    public Result<LoginResponse> adminLogin(@Valid @RequestBody AdminLoginRequest req) {
        return Result.success(authService.adminLogin(req));
    }

    /** 获取当前用户信息 / Get current user info */
    @GetMapping("/info")
    public Result<?> getUserInfo() {
        return Result.success(authService.getCurrentUserInfo());
    }
}
