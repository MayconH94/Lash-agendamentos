package com.lashsystem.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;

public record ServiceRequest(
        @NotBlank @Size(max = 100) String name,
        @Size(max = 500) String description,
        @Size(max = 500) String imageUrl,
        UUID categoryId,
        @Min(0) Integer displayOrder,
        @NotNull @Min(5) Integer durationMinutes,
        @NotNull @Min(0) Integer bufferMinutes,
        @NotNull @DecimalMin("0.00") BigDecimal price,
        @Min(1) @Max(365) Integer maintenanceDays
) {}