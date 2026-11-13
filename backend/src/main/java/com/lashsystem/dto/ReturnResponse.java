package com.lashsystem.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

// daysOverdue > 0: prazo vencido há N dias; <= 0: faltam |N| dias para o prazo
public record ReturnResponse(
        String clientName, String clientPhone,
        UUID serviceId, String serviceName,
        Instant lastVisit, LocalDate dueDate, long daysOverdue
) {}
