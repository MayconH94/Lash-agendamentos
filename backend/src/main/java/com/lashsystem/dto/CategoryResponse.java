package com.lashsystem.dto;

import java.util.UUID;

public record CategoryResponse(UUID id, String name, int displayOrder) {}