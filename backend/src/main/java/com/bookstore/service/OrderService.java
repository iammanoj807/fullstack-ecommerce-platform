/**
 * OrderService - Business logic for order management.
 * 
 * Handles order creation from cart, payment processing,
 * order status updates, and order history retrieval.
 */
package com.bookstore.service;

import com.bookstore.dto.OrderRequest;
import com.bookstore.entity.*;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CartService cartService; // To clear cart

    @Transactional
    public Order placeOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Validate stock and calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new java.util.ArrayList<>();

        // Create Order skeleton
        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .paymentProvider(request.getPaymentProvider())
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        for (CartItem cartItem : cart.getItems()) {
            Book book = cartItem.getBook();
            if (book.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for book: " + book.getTitle());
            }
            // Reduce stock
            book.setStockQuantity(book.getStockQuantity() - cartItem.getQuantity());
            bookRepository.save(book);

            BigDecimal subtotal = book.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .bookId(book.getId())
                    .bookTitle(book.getTitle())
                    .bookCover(book.getCoverImageUrl())
                    .unitPrice(book.getPrice())
                    .quantity(cartItem.getQuantity())
                    .subtotal(subtotal)
                    .build();
            orderItems.add(orderItem);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        // Simulate payment
        boolean paymentSuccess = simulatePayment();
        if (paymentSuccess) {
            order.setStatus(OrderStatus.PAID);
            order.setPaymentStatus(PaymentStatus.SUCCESS);
            order.setPaymentReference("PAY-" + System.currentTimeMillis());
        } else {
            order.setPaymentStatus(PaymentStatus.FAILED);
            // Revert stock? Requirements say "If payment succeeds...".
            // If failed, usually we keep order as PENDING_PAYMENT or CANCELLED, and don't
            // reduce stock?
            // "Validate stock for each book, reduce stock when order is successfully
            // created."
            // I'll keep stock reduced for PENDING orders too, or revert if FAILED.
            // Simplified: If failed, we throw exception or keep it failed?
            // "simulate a payment service... If payment succeeds, set ... SUCCESS".
            // I'll assume creation is successful regardless, payment status differs.
            order.setStatus(OrderStatus.PENDING); // Or CANCELLED if we want strict
        }

        Order savedOrder = orderRepository.save(order);
        System.out.println(
                "DEBUG: Order saved successfully with ID: " + savedOrder.getId() + " for user: " + user.getEmail());

        // Clear cart if successful? "Clear the user cart after successful order."
        if (paymentSuccess || order.getPaymentStatus() == PaymentStatus.PENDING) {
            cartService.clearCart(userEmail);
        }

        return savedOrder;
    }

    private boolean simulatePayment() {
        return Math.random() > 0.1; // 90% success
    }

    public Page<Order> getUserOrders(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user, pageable);
    }

    public Order getOrder(String userEmail, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }
        return order;
    }

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }
}
