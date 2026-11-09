package com.lashsystem.dto;

import java.time.Instant;

public record SlotResponse(Instant startTime, String label) {}