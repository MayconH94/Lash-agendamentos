package com.lashsystem.controller;

import com.lashsystem.dto.AdminAppointmentResponse;
import com.lashsystem.service.AdminAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/appointments")
@RequiredArgsConstructor
public class AdminAppointmentController {

    private final AdminAppointmentService service;

    @GetMapping
    public List<AdminAppointmentResponse> list(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.listByDay(date);
    }

    @PatchMapping("/{id}/cancel")
    public AdminAppointmentResponse cancel(@PathVariable UUID id) {
        return service.cancel(id);
    }
}
