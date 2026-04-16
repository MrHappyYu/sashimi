package com.sashimi.module.reservation.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * 创建预订请求 / Create reservation request
 */
@Data
public class CreateReservationRequest {
    @NotNull(message = "预订日期不能为空")
    private String reservationDate;   // yyyy-MM-dd

    @NotBlank(message = "预订时间不能为空")
    private String reservationTime;   // HH:mm

    @Min(value = 1, message = "用餐人数至少1人")
    @Max(value = 20, message = "用餐人数最多20人")
    private Integer peopleCount;

    @NotBlank(message = "联系人姓名不能为空")
    private String contactName;

    @NotBlank(message = "联系电话不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "联系电话格式不正确")
    private String contactPhone;

    private String remark;
}
