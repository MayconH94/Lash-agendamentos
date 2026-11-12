package com.lashsystem.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record AdminServiceResponse(
        UUID id,
        String name,
        String description,
        String imageUrl,
        UUID categoryId,
        String categoryName,
        int displayOrder,
        int durationMinutes,
        int bufferMinutes,
        BigDecimal price,
        boolean active
) {}