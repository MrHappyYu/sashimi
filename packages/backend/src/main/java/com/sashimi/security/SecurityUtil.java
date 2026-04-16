package com.sashimi.security;

import com.sashimi.common.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 安全上下文工具 / Security context utility
 */
public class SecurityUtil {

    /**
     * 获取当前登录用户ID / Get current user ID
     */
    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new BusinessException(401, "请先登录");
        }
        String subject = (String) auth.getPrincipal();
        return Long.parseLong(subject.split(":")[0]);
    }

    /**
     * 获取当前用户角色 / Get current user role
     */
    public static String getCurrentRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return "anonymous";
        String subject = (String) auth.getPrincipal();
        String[] parts = subject.split(":");
        return parts.length > 1 ? parts[1] : "user";
    }
}
