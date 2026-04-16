package com.sashimi.module.order.service;

import com.sashimi.module.order.entity.SmOrder;
import com.sashimi.module.order.entity.SmOrderItem;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 订单 Mapper / Order mapper
 */
@Mapper
public interface OrderMapper {

    @Insert("INSERT INTO sm_order (order_no, user_id, order_type, reservation_id, total_amount, status, remark) " +
            "VALUES (#{orderNo}, #{userId}, #{orderType}, #{reservationId}, #{totalAmount}, 0, #{remark})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertOrder(SmOrder order);

    @Insert("<script>" +
            "INSERT INTO sm_order_item (order_id, dish_id, dish_name, dish_image, price, quantity, subtotal) VALUES " +
            "<foreach item='item' collection='items' separator=','>" +
            "(#{item.orderId}, #{item.dishId}, #{item.dishName}, #{item.dishImage}, #{item.price}, #{item.quantity}, #{item.subtotal})" +
            "</foreach>" +
            "</script>")
    void insertItems(@Param("items") List<SmOrderItem> items);

    @Select("<script>" +
            "SELECT * FROM sm_order WHERE user_id = #{userId} " +
            "<if test='status != null'>AND status = #{status} </if>" +
            "ORDER BY create_time DESC" +
            "</script>")
    List<SmOrder> listByUser(@Param("userId") Long userId, @Param("status") Integer status);

    @Select("SELECT * FROM sm_order WHERE id = #{id}")
    SmOrder findById(Long id);

    @Select("SELECT * FROM sm_order_item WHERE order_id = #{orderId}")
    List<SmOrderItem> findItemsByOrderId(Long orderId);

    @Update("UPDATE sm_order SET status = #{status} WHERE id = #{id} AND user_id = #{userId}")
    void updateStatus(@Param("id") Long id, @Param("userId") Long userId, @Param("status") Integer status);

    // 管理端 / Admin queries
    @Select("<script>" +
            "SELECT o.*, u.nickname as user_nickname FROM sm_order o " +
            "LEFT JOIN sm_user u ON o.user_id = u.id " +
            "<where>" +
            "<if test='status != null'>AND o.status = #{status} </if>" +
            "</where>" +
            "ORDER BY o.create_time DESC" +
            "</script>")
    List<SmOrder> listAdmin(@Param("status") Integer status);

    @Update("UPDATE sm_order SET status = #{status} WHERE id = #{id}")
    void updateStatusAdmin(@Param("id") Long id, @Param("status") Integer status);

    @Select("SELECT COUNT(*) FROM sm_order WHERE DATE(create_time) = CURDATE()")
    int countTodayOrders();

    @Select("SELECT COALESCE(SUM(total_amount), 0) FROM sm_order WHERE DATE(create_time) = CURDATE() AND status != 4")
    java.math.BigDecimal sumTodayAmount();
}
