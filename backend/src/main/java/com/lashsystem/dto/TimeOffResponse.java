package com.lashsystem.dto;

import java.time.Instant;
import java.util.UUID;

public record TimeOffResponse(UUID id, Instant startTime, Instant endTime, String reason) {}
