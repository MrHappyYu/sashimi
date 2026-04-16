package com.sashimi.module.reservation.entity;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 预订实体 / Reservation entity
 */
@Data
public class SmReservation {
    private Long id;
    private Long userId;
    private LocalDate reservationDate;
    private String reservationTime;
    private Integer peopleCount;
    private String contactName;
    private String contactPhone;
    private String remark;
    private Integer status;           // 0待确认 1已确认 2已取消 3已完成
    private LocalDateTime createTime;

    // 关联用户信息 (管理端用) / User info for admin
    private String userNickname;
}
