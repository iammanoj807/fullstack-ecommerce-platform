/**
 * CartController - REST API for shopping cart operations.
 * 
 * Endpoints:
 * - GET /api/cart - Get current user's cart
 * - POST /api/cart/items - Add item to cart
 * - PUT /api/cart/items/{id} - Update item quantity
 * - DELETE /api/cart/items/{id} - Remove item from cart
 * - DELETE /api/cart - Clear entire cart
 */
package com.bookstore.controller;

import com.bookstore.dto.AddToCartRequest;
import com.bookstore.dto.CartDto;
import com.bookstore.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addToCart(@Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateItemQuantity(@PathVariable Long itemId, @RequestBody AddToCartRequest request,
            Authentication authentication) {
        // We reuse AddToCartRequest structure to get quantity, or just check body for
        // quantity
        return ResponseEntity
                .ok(cartService.updateItemQuantity(authentication.getName(), itemId, request.getQuantity()));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId, Authentication authentication) {
        cartService.removeFromCart(authentication.getName(), itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
