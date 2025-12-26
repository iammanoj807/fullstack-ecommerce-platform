/**
 * PaymentStatus Enum - Defines payment transaction states.
 * PENDING: Payment initiated but not completed.
 * SUCCESS: Payment completed successfully.
 * FAILED: Payment failed or was declined.
 */
package com.bookstore.entity;

public enum PaymentStatus {
    PENDING,
    SUCCESS,
    FAILED
}
