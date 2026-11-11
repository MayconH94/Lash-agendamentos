package com.lashsystem.repository;

import com.lashsystem.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, UUID> {
}