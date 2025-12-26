/**
 * UserService - Business logic for user profile management.
 * 
 * Handles profile updates, password changes, account deletion,
 * and recalculates book ratings when user reviews are deleted.
 */
package com.bookstore.service;

import com.bookstore.dto.ChangePasswordRequest;
import com.bookstore.dto.UpdateProfileRequest;
import com.bookstore.dto.UserProfileDto;
import com.bookstore.entity.Book;
import com.bookstore.entity.Review;
import com.bookstore.entity.User;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.ReviewRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    public UserProfileDto getUserProfile(String email) {
        User user = getUserByEmail(email);
        return mapToDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UpdateProfileRequest request) {
        User user = getUserByEmail(email);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = getUserByEmail(email);
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect old password");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String email) {
        User user = getUserByEmail(email);

        // Delete user's cart first (foreign key constraint)
        cartRepository.findByUser(user).ifPresent(cart -> cartRepository.delete(cart));

        // Delete user's orders
        orderRepository.deleteAll(orderRepository.findByUser(user));

        // Get user's reviews and affected books before deleting
        List<Review> userReviews = reviewRepository.findByUser(user);
        Set<Book> affectedBooks = userReviews.stream()
                .map(Review::getBook)
                .collect(Collectors.toSet());

        // Delete user's reviews
        reviewRepository.deleteAll(userReviews);

        // Recalculate ratings for affected books
        for (Book book : affectedBooks) {
            List<Review> remainingReviews = reviewRepository.findByBook(book);
            if (remainingReviews.isEmpty()) {
                book.setRatingAverage(0.0);
                book.setRatingCount(0);
            } else {
                double avgRating = remainingReviews.stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);
                book.setRatingAverage(avgRating);
                book.setRatingCount(remainingReviews.size());
            }
            bookRepository.save(book);
        }

        // Now delete the user
        userRepository.delete(user);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserProfileDto mapToDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles())
                .build();
    }
}
