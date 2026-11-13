package com.lashsystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

// allDay = true ignora start/end. Caso contrário start e end ("HH:mm") são obrigatórios.
public record TimeOffRequest(
        @NotNull LocalDate date,
        boolean allDay,
        @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$") String start,
        @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$") String end,
        @Size(max = 100) String reason
) {}
