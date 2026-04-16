package com.sashimi.module.reservation.service;

import com.sashimi.common.BusinessException;
import com.sashimi.module.reservation.dto.CreateReservationRequest;
import com.sashimi.module.reservation.entity.SmReservation;
import com.sashimi.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 预订服务 / Reservation service
 */
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationMapper reservationMapper;

    @Value("#{'${app.reservation.time-slots}'.split(',')}")
    private List<String> timeSlots;

    @Value("${app.reservation.max-people-per-slot}")
    private int maxPeoplePerSlot;

    public SmReservation create(CreateReservationRequest req) {
        // 校验日期不能是过去 / Validate date is not in the past
        LocalDate date = LocalDate.parse(req.getReservationDate());
        if (date.isBefore(LocalDate.now())) {
            throw new BusinessException("预订日期不能早于今天");
        }

        // 校验时间段是否合法 / Validate time slot
        if (!timeSlots.contains(req.getReservationTime())) {
            throw new BusinessException("无效的预订时间段");
        }

        // 校验该时段剩余容量 / Check remaining capacity
        int booked = reservationMapper.countBookedPeople(req.getReservationDate(), req.getReservationTime());
        if (booked + req.getPeopleCount() > maxPeoplePerSlot) {
            throw new BusinessException("该时段剩余座位不足，请选择其他时间");
        }

        SmReservation reservation = new SmReservation();
        reservation.setUserId(SecurityUtil.getCurrentUserId());
        reservation.setReservationDate(date);
        reservation.setReservationTime(req.getReservationTime());
        reservation.setPeopleCount(req.getPeopleCount());
        reservation.setContactName(req.getContactName());
        reservation.setContactPhone(req.getContactPhone());
        reservation.setRemark(req.getRemark());
        reservationMapper.insert(reservation);
        return reservation;
    }

    public List<SmReservation> list() {
        return reservationMapper.listByUser(SecurityUtil.getCurrentUserId());
    }

    public SmReservation detail(Long id) {
        SmReservation r = reservationMapper.findById(id);
        if (r == null) throw new BusinessException("预订不存在");
        if (!r.getUserId().equals(SecurityUtil.getCurrentUserId())) {
            throw new BusinessException(403, "无权查看此预订");
        }
        return r;
    }

    public void cancel(Long id) {
        reservationMapper.cancelByUser(id, SecurityUtil.getCurrentUserId());
    }

    /**
     * 获取某日期可用时间段及剩余容量
     * Get available time slots with remaining capacity for a date
     */
    public List<Map<String, Object>> getTimeSlots(String date) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (String slot : timeSlots) {
            int booked = reservationMapper.countBookedPeople(date, slot);
            int remaining = maxPeoplePerSlot - booked;
            result.add(Map.of(
                "time", slot,
                "remaining", remaining,
                "available", remaining > 0
            ));
        }
        return result;
    }
}
