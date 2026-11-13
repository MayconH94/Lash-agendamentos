package com.lashsystem.controller;

import com.lashsystem.dto.SettingsRequest;
import com.lashsystem.dto.SettingsResponse;
import com.lashsystem.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
public class SettingsController {

    private final SettingsService settings;

    public SettingsController(SettingsService settings) {
        this.settings = settings;
    }

    // público: a tela da cliente usa para montar o link do WhatsApp
    @GetMapping("/api/settings")
    public SettingsResponse publicSettings() {
        return settings.get();
    }

    @GetMapping("/api/admin/settings")
    public SettingsResponse adminSettings() {
        return settings.get();
    }

    @PutMapping("/api/admin/settings")
    public SettingsResponse update(@Valid @RequestBody SettingsRequest request) {
        return settings.update(request.whatsapp());
    }
}