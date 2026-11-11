package com.lashsystem.dto;

import com.lashsystem.entity.SalonService;

import java.math.BigDecimal;
import java.util.UUID;

public record ServiceResponse(
        UUID id,
        String name,
        String description,
        String imageUrl,
        int durationMinutes,
        int bufferMinutes,
        BigDecimal price,
        UUID categoryId,
        String categoryName
) {
    public static ServiceResponse from(SalonService s, String categoryName) {
        return new ServiceResponse(s.getId(), s.getName(), s.getDescription(), s.getImageUrl(),
                s.getDurationMinutes(), s.getBufferMinutes(), s.getPrice(),
                s.getCategoryId(), categoryName);
    }
}