package com.kernel.controller;

import com.kernel.model.CartItem;
import com.kernel.model.Product;
import com.kernel.repository.CartItemRepository;
import com.kernel.repository.ProductRepository;
import com.kernel.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartController(CartItemRepository cartItemRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@RequestParam Long userId) {
        return ResponseEntity.ok(cartItemRepository.findByUserId(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody Map<String, Object> payload) {
        if (payload.get("userId") == null || payload.get("productId") == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID and product ID are required.");
        }
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long productId = Long.valueOf(payload.get("productId").toString());
        Integer quantity = payload.containsKey("quantity") ? Integer.valueOf(payload.get("quantity").toString()) : 1;
        if (quantity < 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1.");
        if (!userRepository.existsById(userId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));

        Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return ResponseEntity.ok(cartItemRepository.save(item));
        } else {
            CartItem newItem = new CartItem(userId, product, quantity);
            return ResponseEntity.ok(cartItemRepository.save(newItem));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        Integer quantity = payload.get("quantity");
        if (quantity == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity is required.");
        CartItem item = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found."));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return ResponseEntity.noContent().build();
        }
        item.setQuantity(quantity);
        return ResponseEntity.ok(cartItemRepository.save(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id) {
        if (!cartItemRepository.existsById(id)) return ResponseEntity.notFound().build();
        cartItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    @Transactional
    public ResponseEntity<Void> clearCart(@RequestParam Long userId) {
        cartItemRepository.deleteByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}
