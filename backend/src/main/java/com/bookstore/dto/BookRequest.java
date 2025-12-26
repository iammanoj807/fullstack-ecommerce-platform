package com.bookstore.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String author;
    private String description;
    private String isbn;
    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;
    private String coverImageUrl;
    @NotNull
    @Min(0)
    private Integer stockQuantity;
    @NotNull
    private Long categoryId;
}
