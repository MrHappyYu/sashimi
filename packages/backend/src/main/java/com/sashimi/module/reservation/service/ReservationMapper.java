package com.sashimi.module.reservation.service;

import com.sashimi.module.reservation.entity.SmReservation;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 预订 Mapper / Reservation mapper
 */
@Mapper
public interface ReservationMapper {

    @Insert("INSERT INTO sm_reservation (user_id, reservation_date, reservation_time, people_count, contact_name, contact_phone, remark) " +
            "VALUES (#{userId}, #{reservationDate}, #{reservationTime}, #{peopleCount}, #{contactName}, #{contactPhone}, #{remark})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(SmReservation reservation);

    @Select("SELECT * FROM sm_reservation WHERE user_id = #{userId} ORDER BY create_time DESC")
    List<SmReservation> listByUser(Long userId);

    @Select("SELECT * FROM sm_reservation WHERE id = #{id}")
    SmReservation findById(Long id);

    @Update("UPDATE sm_reservation SET status = 2 WHERE id = #{id} AND user_id = #{userId} AND status = 0")
    void cancelByUser(@Param("id") Long id, @Param("userId") Long userId);

    // 查询某日期某时段已预订人数 / Count booked people for a time slot
    @Select("SELECT COALESCE(SUM(people_count), 0) FROM sm_reservation " +
            "WHERE reservation_date = #{date} AND reservation_time = #{time} AND status IN (0, 1)")
    int countBookedPeople(@Param("date") String date, @Param("time") String time);

    // 管理端 / Admin
    @Select("<script>" +
            "SELECT r.*, u.nickname as user_nickname FROM sm_reservation r " +
            "LEFT JOIN sm_user u ON r.user_id = u.id " +
            "<where>" +
            "<if test='status != null'>AND r.status = #{status} </if>" +
            "<if test='date != null'>AND r.reservation_date = #{date} </if>" +
            "</where>" +
            "ORDER BY r.reservation_date, r.reservation_time" +
            "</script>")
    List<SmReservation> listAdmin(@Param("status") Integer status, @Param("date") String date);

    @Update("UPDATE sm_reservation SET status = #{status} WHERE id = #{id}")
    void updateStatus(@Param("id") Long id, @Param("status") Integer status);

    @Select("SELECT COUNT(*) FROM sm_reservation WHERE status = 0")
    int countPendingReservations();
}
