/**
 * OrderStatus Enum - Defines order lifecycle states.
 * PENDING → PAID → SHIPPED → DELIVERED or CANCELLED
 */
package com.bookstore.entity;

public enum OrderStatus {
    PENDING,
    PAID,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
