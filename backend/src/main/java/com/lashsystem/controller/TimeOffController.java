package com.lashsystem.controller;

import com.lashsystem.dto.TimeOffRequest;
import com.lashsystem.dto.TimeOffResponse;
import com.lashsystem.service.TimeOffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/time-off")
@RequiredArgsConstructor
public class TimeOffController {

    private final TimeOffService service;

    @GetMapping
    public List<TimeOffResponse> list() {
        return service.listUpcoming();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TimeOffResponse create(@Valid @RequestBody TimeOffRequest request) {
        return service.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
