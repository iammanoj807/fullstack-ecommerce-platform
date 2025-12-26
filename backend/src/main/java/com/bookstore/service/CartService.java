/**
 * CartService - Business logic for shopping cart.
 * 
 * Manages cart operations: add items, update quantities,
 * remove items, clear cart, and calculate totals.
 * Creates cart automatically for new users.
 */
package com.bookstore.service;

import com.bookstore.dto.AddToCartRequest;
import com.bookstore.dto.CartDto;
import com.bookstore.dto.CartItemDto;
import com.bookstore.entity.Book;
import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.entity.User;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartItemRepository;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public CartDto getCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto addToCart(String userEmail, AddToCartRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Not enough stock");
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getBook().getId().equals(book.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (book.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Not enough stock");
            }
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .book(book)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToDto(cart);
    }

    @Transactional
    public CartDto updateItemQuantity(String userEmail, Long itemId, int quantity) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user); // Validate ownership indirectly? No, need check.

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Access denied");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (item.getBook().getStockQuantity() < quantity) {
                throw new RuntimeException("Not enough stock");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToDto(cart);
    }

    @Transactional
    public void removeFromCart(String userEmail, Long itemId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Access denied");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear(); // Cascade logic handles deletion if orphanRemoval=true
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    private CartDto mapToDto(Cart cart) {
        BigDecimal total = BigDecimal.ZERO;
        var items = cart.getItems().stream().map(item -> {
            BigDecimal subtotal = item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return CartItemDto.builder()
                    .id(item.getId())
                    .bookId(item.getBook().getId())
                    .bookTitle(item.getBook().getTitle())
                    .coverImageUrl(item.getBook().getCoverImageUrl())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getBook().getPrice())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        for (var item : items) {
            total = total.add(item.getSubtotal());
        }

        return CartDto.builder()
                .id(cart.getId())
                .items(items)
                .totalAmount(total)
                .build();
    }
}
