package com.bookstore.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartDto {
    private Long id;
    private List<CartItemDto> items;
    private BigDecimal totalAmount;
}
