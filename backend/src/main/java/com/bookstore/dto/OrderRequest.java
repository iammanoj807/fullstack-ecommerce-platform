package com.bookstore.dto;

import com.bookstore.entity.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotNull
    @Valid
    private Address shippingAddress;
    private String paymentProvider;
}
