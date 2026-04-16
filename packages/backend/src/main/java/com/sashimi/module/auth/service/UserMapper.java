package com.sashimi.module.auth.service;

import com.sashimi.module.auth.entity.SmAdmin;
import com.sashimi.module.auth.entity.SmUser;
import org.apache.ibatis.annotations.*;

/**
 * 用户 Mapper / User mapper
 */
@Mapper
public interface UserMapper {

    @Select("SELECT * FROM sm_user WHERE openid = #{openid}")
    SmUser findByOpenid(String openid);

    @Insert("INSERT INTO sm_user (openid, nickname, avatar_url) VALUES (#{openid}, #{nickname}, #{avatarUrl})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(SmUser user);

    @Update("UPDATE sm_user SET nickname=#{nickname}, avatar_url=#{avatarUrl} WHERE id=#{id}")
    void updateProfile(SmUser user);

    @Select("SELECT * FROM sm_user WHERE id = #{id}")
    SmUser findById(Long id);

    @Select("SELECT * FROM sm_admin WHERE username = #{username} AND status = 1")
    SmAdmin findAdminByUsername(String username);
}
