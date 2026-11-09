package com.lashsystem.repository;

import com.lashsystem.entity.SalonService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SalonServiceRepository extends JpaRepository<SalonService, UUID> {

    List<SalonService> findByActiveTrue();
}
