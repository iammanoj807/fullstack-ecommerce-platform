/**
 * OrderController - REST API for order management.
 * 
 * Endpoints:
 * - GET /api/orders - Get user's order history
 * - GET /api/orders/{id} - Get single order details
 * - POST /api/orders - Create new order from cart
 * - PUT /api/admin/orders/{id}/status - Update order status (admin)
 */
package com.bookstore.controller;

import com.bookstore.dto.OrderRequest;
import com.bookstore.entity.Order;
import com.bookstore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/orders")
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderRequest request, Authentication authentication) {
        return ResponseEntity.ok(orderService.placeOrder(authentication.getName(), request));
    }

    @GetMapping("/api/orders")
    public ResponseEntity<Page<Order>> getUserOrders(
            Authentication authentication,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        System.out.println("DEBUG: Fetching orders for user: " + authentication.getName());
        Page<Order> orders = orderService.getUserOrders(authentication.getName(), pageable);
        System.out
                .println("DEBUG: Found " + orders.getTotalElements() + " orders for user " + authentication.getName());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrder(authentication.getName(), id));
    }

    // Admin endpoints

    @GetMapping("/api/admin/orders")
    public ResponseEntity<Page<Order>> getAllOrders(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        String status = statusMap.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
