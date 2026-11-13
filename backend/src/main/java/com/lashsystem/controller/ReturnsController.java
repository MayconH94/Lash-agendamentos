package com.lashsystem.controller;

import com.lashsystem.dto.ReturnResponse;
import com.lashsystem.service.ReturnsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/returns")
@RequiredArgsConstructor
public class ReturnsController {

    private final ReturnsService service;

    @GetMapping
    public List<ReturnResponse> list() {
        return service.list();
    }
}
