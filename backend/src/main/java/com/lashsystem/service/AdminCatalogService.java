package com.lashsystem.service;

import com.lashsystem.dto.*;
import com.lashsystem.entity.SalonService;
import com.lashsystem.entity.ServiceCategory;
import com.lashsystem.exception.ResourceNotFoundException;
import com.lashsystem.repository.SalonServiceRepository;
import com.lashsystem.repository.ServiceCategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AdminCatalogService {

    private final SalonServiceRepository services;
    private final ServiceCategoryRepository categories;

    public AdminCatalogService(SalonServiceRepository services, ServiceCategoryRepository categories) {
        this.services = services;
        this.categories = categories;
    }

    // ---------- Serviços ----------

    @Transactional(readOnly = true)
    public List<AdminServiceResponse> listServices() {
        Map<UUID, ServiceCategory> byId = categories.findAll().stream()
                .collect(Collectors.toMap(ServiceCategory::getId, Function.identity()));

        return services.findAll().stream()
                .sorted(Comparator
                        .comparingInt((SalonService s) -> categoryOrder(s, byId))
                        .thenComparingInt(SalonService::getDisplayOrder)
                        .thenComparing(SalonService::getName, String.CASE_INSENSITIVE_ORDER))
                .map(s -> toResponse(s, byId.get(s.getCategoryId())))
                .toList();
    }

    @Transactional
    public AdminServiceResponse createService(ServiceRequest request) {
        SalonService s = new SalonService();
        apply(s, request);
        s.setActive(true);
        return toResponse(services.save(s));
    }

    @Transactional
    public AdminServiceResponse updateService(UUID id, ServiceRequest request) {
        SalonService s = find(id);
        apply(s, request);
        return toResponse(services.save(s));
    }

    @Transactional
    public AdminServiceResponse setActive(UUID id, boolean active) {
        SalonService s = find(id);
        s.setActive(active);
        return toResponse(services.save(s));
    }

    // ---------- Categorias ----------

    @Transactional(readOnly = true)
    public List<CategoryResponse> listCategories() {
        return categories.findAll().stream()
                .sorted(Comparator.comparingInt(ServiceCategory::getDisplayOrder)
                        .thenComparing(ServiceCategory::getName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String name = request.name().trim();
        if (categories.findByNameIgnoreCase(name).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma categoria com esse nome");
        }
        ServiceCategory c = new ServiceCategory();
        c.setName(name);
        c.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
        return toResponse(categories.save(c));
    }

    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        ServiceCategory c = categories.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
        String name = request.name().trim();
        categories.findByNameIgnoreCase(name).ifPresent(other -> {
            if (!other.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma categoria com esse nome");
            }
        });
        c.setName(name);
        c.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
        return toResponse(categories.save(c));
    }

    // ---------- Auxiliares ----------

    private SalonService find(UUID id) {
        return services.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));
    }

    private void apply(SalonService s, ServiceRequest r) {
        if (r.categoryId() != null && !categories.existsById(r.categoryId())) {
            throw new ResourceNotFoundException("Categoria não encontrada");
        }
        s.setName(r.name().trim());
        s.setDescription(blankToNull(r.description()));
        s.setImageUrl(blankToNull(r.imageUrl()));
        s.setCategoryId(r.categoryId());
        s.setDisplayOrder(r.displayOrder() == null ? 0 : r.displayOrder());
        s.setDurationMinutes(r.durationMinutes());
        s.setBufferMinutes(r.bufferMinutes());
        s.setPrice(r.price());
        s.setMaintenanceDays(r.maintenanceDays());
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private int categoryOrder(SalonService s, Map<UUID, ServiceCategory> byId) {
        ServiceCategory c = s.getCategoryId() == null ? null : byId.get(s.getCategoryId());
        return c == null ? Integer.MAX_VALUE : c.getDisplayOrder();
    }

    private AdminServiceResponse toResponse(SalonService s) {
        ServiceCategory c = s.getCategoryId() == null ? null
                : categories.findById(s.getCategoryId()).orElse(null);
        return toResponse(s, c);
    }

    private AdminServiceResponse toResponse(SalonService s, ServiceCategory c) {
        return new AdminServiceResponse(
                s.getId(), s.getName(), s.getDescription(), s.getImageUrl(),
                s.getCategoryId(), c == null ? null : c.getName(),
                s.getDisplayOrder(), s.getDurationMinutes(), s.getBufferMinutes(),
                s.getPrice(), s.getMaintenanceDays(), s.isActive());
    }

    private CategoryResponse toResponse(ServiceCategory c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDisplayOrder());
    }
}