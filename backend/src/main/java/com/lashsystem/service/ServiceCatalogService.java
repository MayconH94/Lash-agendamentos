package com.lashsystem.service;

import com.lashsystem.dto.ServiceResponse;
import com.lashsystem.entity.SalonService;
import com.lashsystem.entity.ServiceCategory;
import com.lashsystem.repository.SalonServiceRepository;
import com.lashsystem.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceCatalogService {

    private final SalonServiceRepository serviceRepository;
    private final ServiceCategoryRepository categoryRepository;

    public List<ServiceResponse> listActive() {
        Map<UUID, ServiceCategory> categories = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(ServiceCategory::getId, Function.identity()));

        return serviceRepository.findByActiveTrue().stream()
                .sorted(Comparator
                        .comparingInt((SalonService s) -> categoryOrder(categories, s))
                        .thenComparingInt(SalonService::getDisplayOrder)
                        .thenComparing(SalonService::getName))
                .map(s -> ServiceResponse.from(s, categoryName(categories, s)))
                .toList();
    }

    private int categoryOrder(Map<UUID, ServiceCategory> categories, SalonService s) {
        ServiceCategory c = categories.get(s.getCategoryId());
        return c == null ? Integer.MAX_VALUE : c.getDisplayOrder();
    }

    private String categoryName(Map<UUID, ServiceCategory> categories, SalonService s) {
        ServiceCategory c = categories.get(s.getCategoryId());
        return c == null ? "Outros" : c.getName();
    }
}