package com.lashsystem.controller;

import com.lashsystem.dto.LoginRequest;
import com.lashsystem.dto.LoginResponse;
import com.lashsystem.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return new LoginResponse(authService.login(request.email(), request.password()));
    }
}
