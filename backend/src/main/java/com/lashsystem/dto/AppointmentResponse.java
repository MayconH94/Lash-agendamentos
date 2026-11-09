package com.lashsystem.dto;

import com.lashsystem.entity.Appointment;

import java.time.Instant;
import java.util.UUID;

public record AppointmentResponse(
        UUID id, String clientName, UUID serviceId,
        Instant startTime, Instant endTime, String status
) {
    public static AppointmentResponse from(Appointment a) {
        return new AppointmentResponse(a.getId(), a.getClientName(), a.getServiceId(),
                a.getStartTime(), a.getEndTime(), a.getStatus());
    }
}
