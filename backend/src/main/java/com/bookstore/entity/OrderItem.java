/**
 * OrderItem Entity - Represents a book item within an order.
 * 
 * Captures book details, quantity, and price at the time of purchase.
 * Multiple order items can belong to a single order.
 */
package com.bookstore.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    private Long bookId;
    private String bookTitle;
    private String bookCover; // Store cover image URL
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
}
