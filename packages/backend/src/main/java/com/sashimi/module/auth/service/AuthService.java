package com.sashimi.module.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sashimi.common.BusinessException;
import com.sashimi.module.auth.dto.AdminLoginRequest;
import com.sashimi.module.auth.dto.LoginResponse;
import com.sashimi.module.auth.dto.WxLoginRequest;
import com.sashimi.module.auth.entity.SmAdmin;
import com.sashimi.module.auth.entity.SmUser;
import com.sashimi.security.JwtUtil;
import com.sashimi.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * 认证服务 / Authentication service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Value("${wx.app-id}")
    private String wxAppId;

    @Value("${wx.app-secret}")
    private String wxAppSecret;

    /**
     * 微信小程序登录 / WeChat mini-program login
     * 使用 code 换取 openid，配置 appId/appSecret 后生效
     * Use code to get openid, takes effect after configuring appId/appSecret
     */
    public LoginResponse wxLogin(WxLoginRequest req) {
        // ===== 微信 code2session 调用 =====
        // 注意：需先在 application.yml 配置 wx.app-id 和 wx.app-secret
        // Note: Requires wx.app-id and wx.app-secret configured in application.yml
        String openid = getOpenIdFromWx(req.getCode());
        // ==================================

        // 查询或创建用户 / Find or create user
        SmUser user = userMapper.findByOpenid(openid);
        if (user == null) {
            user = new SmUser();
            user.setOpenid(openid);
            user.setNickname(req.getNickname() != null ? req.getNickname() : "刺身爱好者");
            user.setAvatarUrl(req.getAvatarUrl());
            userMapper.insert(user);
        } else if (req.getNickname() != null) {
            user.setNickname(req.getNickname());
            user.setAvatarUrl(req.getAvatarUrl());
            userMapper.updateProfile(user);
        }

        String token = jwtUtil.generateToken(user.getId() + ":user");
        return LoginResponse.builder()
                .token(token)
                .role("user")
                .userId(user.getId())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    /**
     * 管理员登录 / Admin login
     */
    public LoginResponse adminLogin(AdminLoginRequest req) {
        SmAdmin admin = userMapper.findAdminByUsername(req.getUsername());
        if (admin == null) {
            throw new BusinessException(401, "用户名或密码错误");
        }
        if (!passwordEncoder.matches(req.getPassword(), admin.getPassword())) {
            throw new BusinessException(401, "用户名或密码错误");
        }
        String token = jwtUtil.generateToken(admin.getId() + ":admin");
        return LoginResponse.builder()
                .token(token)
                .role("admin")
                .userId(admin.getId())
                .nickname(admin.getNickname())
                .build();
    }

    /**
     * 获取当前用户信息 / Get current user info
     */
    public SmUser getCurrentUserInfo() {
        Long userId = SecurityUtil.getCurrentUserId();
        SmUser user = userMapper.findById(userId);
        if (user == null) throw new BusinessException("用户不存在");
        return user;
    }

    /**
     * 调用微信 code2session 接口获取 openid
     * Call WeChat code2session API to get openid
     *
     * 留白说明 / Placeholder note:
     * 正式使用时请在 application.yml 填写真实的 wx.app-id 和 wx.app-secret
     * 微信接口文档: https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
     */
    private String getOpenIdFromWx(String code) {
        // 检查是否已配置 / Check if configured
        if ("YOUR_WX_APP_ID".equals(wxAppId) || "YOUR_WX_APP_SECRET".equals(wxAppSecret)) {
            // 开发模式：使用 code 作为 openid (仅用于本地测试)
            // Dev mode: use code as openid (local testing only)
            log.warn("微信 AppID/AppSecret 未配置，当前使用 code 作为 openid（仅限测试）");
            return "test_openid_" + code;
        }

        String url = String.format(
            "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
            wxAppId, wxAppSecret, code
        );

        try {
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(response);

            if (node.has("errcode")) {
                int errcode = node.get("errcode").asInt();
                String errmsg = node.get("errmsg").asText();
                throw new BusinessException("微信登录失败: [" + errcode + "] " + errmsg);
            }

            return node.get("openid").asText();
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("调用微信 code2session 失败", e);
            throw new BusinessException("微信登录服务异常，请稍后重试");
        }
    }
}
