package com.bookstore.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Welcome Controller - Provides a friendly message at root endpoints
 */
@RestController
public class WelcomeController {

    @GetMapping("/")
    public Map<String, String> welcome() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to Online BookStore API!");
        response.put("status", "running");
        response.put("docs", "/swagger-ui.html");
        return response;
    }

    @GetMapping("/api")
    public Map<String, String> apiWelcome() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Online BookStore API v1.0");
        response.put("endpoints", "/api/books, /api/auth, /api/cart, /api/orders");
        return response;
    }
}
