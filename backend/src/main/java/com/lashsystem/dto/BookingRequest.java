package com.lashsystem.dto;

import jakarta.validation.constraints.*;

import java.time.Instant;
import java.util.UUID;

public record BookingRequest(
        @NotBlank @Size(max = 150) String clientName,
        @NotBlank @Pattern(regexp = "\\d{10,13}", message = "Telefone deve ter só números (DDD + número)") String clientPhone,
        @NotNull UUID serviceId,
        @NotNull @Future Instant startTime
) {}
