package com.lashsystem.service;

import com.lashsystem.dto.SettingsResponse;
import com.lashsystem.entity.SalonSettings;
import com.lashsystem.repository.SalonSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsService {

    private static final int ID = 1;

    private final SalonSettingsRepository repository;

    public SettingsService(SalonSettingsRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public SettingsResponse get() {
        return new SettingsResponse(
                repository.findById(ID).map(SalonSettings::getWhatsapp).orElse(null));
    }

    @Transactional
    public SettingsResponse update(String whatsapp) {
        SalonSettings settings = repository.findById(ID)
                .orElseGet(() -> new SalonSettings(ID, null));
        settings.setWhatsapp(whatsapp == null || whatsapp.isBlank()
                ? null
                : whatsapp.replaceAll("\\D", ""));
        return new SettingsResponse(repository.save(settings).getWhatsapp());
    }
}