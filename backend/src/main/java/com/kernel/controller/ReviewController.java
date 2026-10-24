package com.kernel.controller;

import com.kernel.model.Review;
import com.kernel.model.User;
import com.kernel.repository.ProductRepository;
import com.kernel.repository.ReviewRepository;
import com.kernel.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, ProductRepository productRepository,
                            UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long productId) {
        if (!productRepository.existsById(productId)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(reviewRepository.findByProductIdOrderByCreatedAtDesc(productId));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Review> addReview(@PathVariable Long productId, @RequestBody ReviewRequest request) {
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found.");
        }
        if (request.userId() == null || request.rating() == null || request.rating() < 1 || request.rating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A user and a rating from 1 to 5 are required.");
        }
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        Review review = new Review(productId, user.getId(), user.getFullName(), request.rating(), request.comment());
        Review savedReview = reviewRepository.save(review);
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        var product = productRepository.findById(productId).orElseThrow();
        product.setReviewCount(reviews.size());
        product.setRating(reviews.stream().mapToInt(Review::getRating).average().orElse(0));
        productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    public record ReviewRequest(Long userId, Integer rating, String comment) {}
}
