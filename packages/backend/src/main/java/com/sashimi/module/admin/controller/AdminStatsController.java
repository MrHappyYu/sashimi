package com.sashimi.module.admin.controller;

import com.sashimi.common.Result;
import com.sashimi.module.order.service.OrderMapper;
import com.sashimi.module.reservation.service.ReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 管理端-数据统计 / Admin statistics
 */
@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final OrderMapper orderMapper;
    private final ReservationMapper reservationMapper;

    /** 概览统计 / Overview stats */
    @GetMapping("/overview")
    public Result<Map<String, Object>> overview() {
        return Result.success(Map.of(
            "todayOrders", orderMapper.countTodayOrders(),
            "todayAmount", orderMapper.sumTodayAmount(),
            "pendingReservations", reservationMapper.countPendingReservations()
        ));
    }
}
