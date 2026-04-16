package com.sashimi.module.dish.service;

import com.sashimi.module.dish.entity.SmDish;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 菜品 Mapper / Dish mapper
 */
@Mapper
public interface DishMapper {

    @Select("<script>" +
            "SELECT d.*, c.name as category_name FROM sm_dish d " +
            "LEFT JOIN sm_category c ON d.category_id = c.id " +
            "WHERE d.status = 1 " +
            "<if test='categoryId != null'>AND d.category_id = #{categoryId} </if>" +
            "<if test='keyword != null and keyword != \"\"'>AND d.name LIKE CONCAT('%', #{keyword}, '%') </if>" +
            "ORDER BY d.sort, d.id" +
            "</script>")
    List<SmDish> list(@Param("categoryId") Long categoryId, @Param("keyword") String keyword);

    @Select("SELECT d.*, c.name as category_name FROM sm_dish d " +
            "LEFT JOIN sm_category c ON d.category_id = c.id " +
            "WHERE d.id = #{id}")
    SmDish findById(Long id);

    @Select("SELECT * FROM sm_dish WHERE is_recommended = 1 AND status = 1 ORDER BY sort LIMIT 10")
    List<SmDish> listRecommended();

    @Select("<script>" +
            "SELECT d.*, c.name as category_name FROM sm_dish d " +
            "LEFT JOIN sm_category c ON d.category_id = c.id " +
            "<where>" +
            "<if test='categoryId != null'>AND d.category_id = #{categoryId} </if>" +
            "<if test='keyword != null and keyword != \"\"'>AND d.name LIKE CONCAT('%', #{keyword}, '%') </if>" +
            "<if test='status != null'>AND d.status = #{status} </if>" +
            "</where>" +
            "ORDER BY d.sort, d.id" +
            "</script>")
    List<SmDish> listAdmin(@Param("categoryId") Long categoryId,
                           @Param("keyword") String keyword,
                           @Param("status") Integer status);

    @Insert("INSERT INTO sm_dish (category_id, name, description, price, original_price, image, sort, status, is_recommended) " +
            "VALUES (#{categoryId}, #{name}, #{description}, #{price}, #{originalPrice}, #{image}, #{sort}, #{status}, #{isRecommended})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(SmDish dish);

    @Update("UPDATE sm_dish SET category_id=#{categoryId}, name=#{name}, description=#{description}, " +
            "price=#{price}, original_price=#{originalPrice}, image=#{image}, sort=#{sort}, " +
            "status=#{status}, is_recommended=#{isRecommended} WHERE id=#{id}")
    void update(SmDish dish);

    @Delete("DELETE FROM sm_dish WHERE id = #{id}")
    void delete(Long id);
}
