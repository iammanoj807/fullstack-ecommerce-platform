/**
 * AuthController - REST API for authentication.
 * 
 * Endpoints:
 * - POST /api/auth/register - Register new user account
 * - POST /api/auth/login - Authenticate user and return JWT token
 */
package com.bookstore.controller;

import com.bookstore.dto.JwtResponse;
import com.bookstore.dto.LoginRequest;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final com.bookstore.service.CaptchaService captchaService;

    @org.springframework.web.bind.annotation.GetMapping("/captcha")
    public ResponseEntity<com.bookstore.dto.CaptchaResponse> getCaptcha() {
        return ResponseEntity.ok(captchaService.generateCaptcha());
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        if (!captchaService.validateCaptcha(request.getCaptchaId(), request.getCaptchaAnswer())) {
            return ResponseEntity.badRequest().body("Invalid CAPTCHA");
        }
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        if (!captchaService.validateCaptcha(request.getCaptchaId(), request.getCaptchaAnswer())) {
            throw new IllegalArgumentException("Invalid CAPTCHA");
        }
        return ResponseEntity.ok(authService.login(request));
    }
}
