package com.lashsystem.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AdminAppointmentResponse(
        UUID id, String clientName, String clientPhone,
        UUID serviceId, String serviceName,
        BigDecimal price, Instant startTime, Instant endTime, String status
) {}
