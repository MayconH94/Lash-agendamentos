package com.lashsystem.controller;

import com.lashsystem.dto.*;
import com.lashsystem.service.AdminCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminCatalogController {

    private final AdminCatalogService catalog;

    public AdminCatalogController(AdminCatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/services")
    public List<AdminServiceResponse> listServices() {
        return catalog.listServices();
    }

    @PostMapping("/services")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminServiceResponse createService(@Valid @RequestBody ServiceRequest request) {
        return catalog.createService(request);
    }

    @PutMapping("/services/{id}")
    public AdminServiceResponse updateService(@PathVariable UUID id, @Valid @RequestBody ServiceRequest request) {
        return catalog.updateService(id, request);
    }

    @PatchMapping("/services/{id}/active")
    public AdminServiceResponse setActive(@PathVariable UUID id, @Valid @RequestBody ActiveRequest request) {
        return catalog.setActive(id, request.active());
    }

    @GetMapping("/categories")
    public List<CategoryResponse> listCategories() {
        return catalog.listCategories();
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {
        return catalog.createCategory(request);
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(@PathVariable UUID id, @Valid @RequestBody CategoryRequest request) {
        return catalog.updateCategory(id, request);
    }
}