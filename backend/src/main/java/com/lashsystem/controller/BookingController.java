package com.lashsystem.controller;

import com.lashsystem.dto.AppointmentResponse;
import com.lashsystem.dto.BookingRequest;
import com.lashsystem.dto.ServiceResponse;
import com.lashsystem.service.AppointmentService;
import com.lashsystem.service.ServiceCatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final AppointmentService appointmentService;
    private final ServiceCatalogService catalogService;

    @GetMapping("/services")
    public List<ServiceResponse> listServices() {
        return catalogService.listActive();
    }

    @PostMapping("/appointments")
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse book(@Valid @RequestBody BookingRequest request) {
        return AppointmentResponse.from(appointmentService.book(
                request.clientName(), request.clientPhone(),
                request.serviceId(), request.startTime()));
    }
}