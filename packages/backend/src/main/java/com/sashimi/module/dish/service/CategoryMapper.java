package com.sashimi.module.dish.service;

import com.sashimi.module.dish.entity.SmCategory;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 分类 Mapper / Category mapper
 */
@Mapper
public interface CategoryMapper {

    @Select("SELECT * FROM sm_category WHERE status = 1 ORDER BY sort")
    List<SmCategory> listActive();

    @Select("SELECT * FROM sm_category ORDER BY sort")
    List<SmCategory> listAll();

    @Select("SELECT * FROM sm_category WHERE id = #{id}")
    SmCategory findById(Long id);

    @Insert("INSERT INTO sm_category (name, icon, sort, status) VALUES (#{name}, #{icon}, #{sort}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(SmCategory category);

    @Update("UPDATE sm_category SET name=#{name}, icon=#{icon}, sort=#{sort}, status=#{status} WHERE id=#{id}")
    void update(SmCategory category);

    @Delete("DELETE FROM sm_category WHERE id = #{id}")
    void delete(Long id);
}
