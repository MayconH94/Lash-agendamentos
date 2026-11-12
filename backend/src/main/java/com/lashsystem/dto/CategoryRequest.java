package com.lashsystem.dto;

import jakarta.validation.constraints.*;

public record CategoryRequest(
        @NotBlank @Size(max = 100) String name,
        @Min(0) Integer displayOrder
) {}