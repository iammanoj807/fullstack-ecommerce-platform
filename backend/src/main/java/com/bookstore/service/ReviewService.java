/**
 * ReviewService - Business logic for book reviews.
 * 
 * Manages review creation (purchase verification required),
 * updates, deletions, and automatic book rating recalculation.
 */
package com.bookstore.service;

import com.bookstore.dto.ReviewRequest;
import com.bookstore.entity.*;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.ReviewRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public Page<Review> getReviewsByBook(Long bookId, Pageable pageable) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return reviewRepository.findByBook(book, pageable);
    }

    @Transactional
    public Review createReview(String userEmail, Long bookId, ReviewRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!hasPurchasedBook(user, book)) {
            throw new RuntimeException("You must purchase the book to review it");
        }

        Review review = Review.builder()
                .user(user)
                .book(book)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);
        updateBookRating(book);
        return savedReview;
    }

    @Transactional
    public Review updateReview(String userEmail, Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);
        updateBookRating(review.getBook());
        return savedReview;
    }

    @Transactional
    public void deleteReview(String userEmail, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }

        Book book = review.getBook();
        reviewRepository.delete(review);
        updateBookRating(book);
    }

    private boolean hasPurchasedBook(User user, Book book) {
        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream()
                .anyMatch(order -> order.getOrderItems().stream()
                        .anyMatch(item -> item.getBookId().equals(book.getId())));
    }

    private void updateBookRating(Book book) {
        List<Review> reviews = reviewRepository.findByBook(book);
        if (reviews.isEmpty()) {
            book.setRatingAverage(0.0);
            book.setRatingCount(0);
        } else {
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            book.setRatingAverage(avg);
            book.setRatingCount(reviews.size());
        }
        bookRepository.save(book);
    }
}
