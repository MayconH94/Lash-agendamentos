package com.lashsystem.repository;

import com.lashsystem.entity.SalonSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalonSettingsRepository extends JpaRepository<SalonSettings, Integer> {
}