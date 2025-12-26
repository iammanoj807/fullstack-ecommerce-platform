/**
 * BookService - Business logic for book operations.
 * 
 * Handles book CRUD operations, search, filtering by category,
 * and price range filtering. Calculates average ratings.
 */
package com.bookstore.service;

import com.bookstore.dto.BookRequest;
import com.bookstore.entity.Book;
import com.bookstore.entity.Category;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public Page<Book> getAllBooks(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String search,
            Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            search = "%";
        } else {
            search = "%" + search + "%";
        }
        return bookRepository.findAllWithFilters(categoryId, minPrice, maxPrice, search, pageable);
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public Book createBook(BookRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .description(request.getDescription())
                .isbn(request.getIsbn())
                .price(request.getPrice())
                .coverImageUrl(request.getCoverImageUrl())
                .stockQuantity(request.getStockQuantity())
                .category(category)
                .ratingAverage(0.0)
                .ratingCount(0)
                .build();

        return bookRepository.save(book);
    }

    public Book updateBook(Long id, BookRequest request) {
        Book book = getBookById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setDescription(request.getDescription());
        book.setIsbn(request.getIsbn());
        book.setPrice(request.getPrice());
        book.setCoverImageUrl(request.getCoverImageUrl());
        book.setStockQuantity(request.getStockQuantity());
        book.setCategory(category);

        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
