package com.lashsystem.controller;

import com.lashsystem.dto.SlotResponse;
import com.lashsystem.service.SlotEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SlotController {

    private final SlotEngineService slotEngine;

    @GetMapping("/slots")
    public List<SlotResponse> slots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam UUID serviceId) {
        return slotEngine.availableSlots(date, serviceId);
    }
}