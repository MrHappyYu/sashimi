package com.sashimi.module.admin.controller;

import com.sashimi.common.Result;
import com.sashimi.module.reservation.entity.SmReservation;
import com.sashimi.module.reservation.service.ReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 管理端-预订管理 / Admin reservation management
 */
@RestController
@RequestMapping("/api/admin/reservation")
@RequiredArgsConstructor
public class AdminReservationController {

    private final ReservationMapper reservationMapper;

    @GetMapping("/list")
    public Result<List<SmReservation>> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String date) {
        return Result.success(reservationMapper.listAdmin(status, date));
    }

    @PutMapping("/{id}/status")
    public Result<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        reservationMapper.updateStatus(id, body.get("status"));
        return Result.success();
    }
}
