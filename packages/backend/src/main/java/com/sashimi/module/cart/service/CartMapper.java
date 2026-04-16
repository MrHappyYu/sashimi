package com.sashimi.module.cart.service;

import com.sashimi.module.cart.entity.SmCart;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 购物车 Mapper / Cart mapper
 */
@Mapper
public interface CartMapper {

    @Select("SELECT * FROM sm_cart WHERE user_id = #{userId} ORDER BY update_time DESC")
    List<SmCart> listByUser(Long userId);

    @Select("SELECT * FROM sm_cart WHERE user_id = #{userId} AND dish_id = #{dishId}")
    SmCart findByUserAndDish(@Param("userId") Long userId, @Param("dishId") Long dishId);

    @Insert("INSERT INTO sm_cart (user_id, dish_id, dish_name, dish_image, price, quantity) " +
            "VALUES (#{userId}, #{dishId}, #{dishName}, #{dishImage}, #{price}, #{quantity})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(SmCart cart);

    @Update("UPDATE sm_cart SET quantity = #{quantity}, update_time = NOW() WHERE id = #{id}")
    void updateQuantity(@Param("id") Long id, @Param("quantity") Integer quantity);

    @Delete("DELETE FROM sm_cart WHERE id = #{id} AND user_id = #{userId}")
    void deleteByIdAndUser(@Param("id") Long id, @Param("userId") Long userId);

    @Delete("DELETE FROM sm_cart WHERE user_id = #{userId}")
    void clearByUser(Long userId);

    @Delete("<script>DELETE FROM sm_cart WHERE user_id = #{userId} AND dish_id IN " +
            "<foreach item='id' collection='dishIds' open='(' separator=',' close=')'>#{id}</foreach>" +
            "</script>")
    void deleteByDishIds(@Param("userId") Long userId, @Param("dishIds") List<Long> dishIds);
}
