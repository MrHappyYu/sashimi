package com.sashimi.module.reservation.controller;

import com.sashimi.common.Result;
import com.sashimi.module.reservation.dto.CreateReservationRequest;
import com.sashimi.module.reservation.entity.SmReservation;
import com.sashimi.module.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 预订接口 / Reservation controller
 */
@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    /** 创建预订 / Create reservation */
    @PostMapping("/create")
    public Result<SmReservation> create(@Valid @RequestBody CreateReservationRequest req) {
        return Result.success(reservationService.create(req));
    }

    /** 我的预订 / My reservations */
    @GetMapping("/list")
    public Result<List<SmReservation>> list() {
        return Result.success(reservationService.list());
    }

    /** 预订详情 / Reservation detail */
    @GetMapping("/{id}")
    public Result<SmReservation> detail(@PathVariable Long id) {
        return Result.success(reservationService.detail(id));
    }

    /** 取消预订 / Cancel reservation */
    @DeleteMapping("/{id}/cancel")
    public Result<?> cancel(@PathVariable Long id) {
        reservationService.cancel(id);
        return Result.success();
    }

    /** 查询可用时间段 / Get available time slots */
    @GetMapping("/time-slots")
    public Result<List<Map<String, Object>>> timeSlots(@RequestParam String date) {
        return Result.success(reservationService.getTimeSlots(date));
    }
}
