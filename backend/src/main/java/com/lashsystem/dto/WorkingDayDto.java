package com.lashsystem.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

// Um dia da semana (1 = segunda ... 7 = domingo) com seus períodos de atendimento.
// Lista vazia = dia fechado.
public record WorkingDayDto(
        @Min(1) @Max(7) int dayOfWeek,
        @NotNull @Valid List<Interval> intervals
) {
    public record Interval(
            @NotNull @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$") String start,
            @NotNull @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$") String end
    ) {}
}
