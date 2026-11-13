package com.lashsystem.dto;

import jakarta.validation.constraints.Pattern;

public record SettingsRequest(
        @Pattern(regexp = "^$|\\d{10,11}", message = "Informe o DDD e o número do WhatsApp")
        String whatsapp
) {}