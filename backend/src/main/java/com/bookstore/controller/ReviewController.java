/**
 * ReviewController - REST API for book reviews.
 * 
 * Endpoints:
 * - GET /api/books/{id}/reviews - Get reviews for a book
 * - POST /api/books/{id}/reviews - Add review (purchase required)
 * - PUT /api/reviews/{id} - Update own review
 * - DELETE /api/reviews/{id} - Delete own review
 */
package com.bookstore.controller;

import com.bookstore.dto.ReviewRequest;
import com.bookstore.entity.Review;
import com.bookstore.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/api/books/{bookId}/reviews")
    public ResponseEntity<Page<Review>> getReviews(
            @PathVariable Long bookId,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByBook(bookId, pageable));
    }

    @PostMapping("/api/books/{bookId}/reviews")
    public ResponseEntity<Review> createReview(
            @PathVariable Long bookId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(reviewService.createReview(authentication.getName(), bookId, request));
    }

    @PutMapping("/api/books/{bookId}/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long bookId, // Not used but part of path
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(reviewService.updateReview(authentication.getName(), reviewId, request));
    }

    @DeleteMapping("/api/books/{bookId}/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long bookId, // Not used
            @PathVariable Long reviewId,
            Authentication authentication) {
        reviewService.deleteReview(authentication.getName(), reviewId);
        return ResponseEntity.noContent().build();
    }
}
