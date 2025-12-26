package com.bookstore.integration;

import com.bookstore.dto.AddToCartRequest;
import com.bookstore.dto.OrderRequest;
import com.bookstore.entity.*;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.AuthService;
import com.bookstore.service.CartService;
import com.bookstore.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class OrderIntegrationTest {

    @Autowired
    private OrderService orderService;
    @Autowired
    private CartService cartService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CartRepository cartRepository;

    private User user;
    private Book book;

    @BeforeEach
    void setUp() {
        // Create User
        user = User.builder()
                .email("customer@example.com")
                .password("password")
                .firstName("Test")
                .roles(Collections.singleton(Role.ROLE_CUSTOMER))
                .enabled(true)
                .build();
        userRepository.save(user);

        // Create Category
        Category category = Category.builder()
                .name("Fiction")
                .slug("fiction")
                .build();
        categoryRepository.save(category);

        // Create Book
        book = Book.builder()
                .title("Great Gatsby")
                .author("F. Scott Fitzgerald")
                .price(BigDecimal.valueOf(10.0))
                .stockQuantity(100)
                .category(category)
                .build();
        bookRepository.save(book);
    }

    @Test
    @WithMockUser(username = "customer@example.com") // Mocks security context
    void placeOrder_ShouldCreateOrder_AndClearCart() {
        // Add to Cart
        AddToCartRequest addRequest = new AddToCartRequest();
        addRequest.setBookId(book.getId());
        addRequest.setQuantity(2);
        cartService.addToCart(user.getEmail(), addRequest);

        // Verify Cart
        var cart = cartService.getCart(user.getEmail());
        assertEquals(1, cart.getItems().size());

        // Place Order
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setShippingAddress(new Address("123 St", null, "City", "12345", "Country"));
        orderRequest.setPaymentProvider("stripe");

        Order order = orderService.placeOrder(user.getEmail(), orderRequest);

        // Verify Order
        assertNotNull(order.getId());
        assertEquals(1, order.getOrderItems().size());
        assertEquals(BigDecimal.valueOf(20.0), order.getTotalAmount());

        // Stock reduced
        Book updatedBook = bookRepository.findById(book.getId()).orElseThrow();
        assertEquals(98, updatedBook.getStockQuantity());

        // Cart cleared
        var clearedCart = cartService.getCart(user.getEmail());
        assertTrue(clearedCart.getItems().isEmpty());
    }
}
