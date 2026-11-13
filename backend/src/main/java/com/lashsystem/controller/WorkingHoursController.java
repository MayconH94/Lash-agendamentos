package com.lashsystem.controller;

import com.lashsystem.dto.WorkingDayDto;
import com.lashsystem.service.WorkingHoursService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/working-hours")
@RequiredArgsConstructor
public class WorkingHoursController {

    private final WorkingHoursService service;

    @GetMapping
    public List<WorkingDayDto> list() {
        return service.list();
    }

    @PutMapping
    public List<WorkingDayDto> replace(@Valid @RequestBody List<@Valid WorkingDayDto> week) {
        return service.replaceAll(week);
    }
}
