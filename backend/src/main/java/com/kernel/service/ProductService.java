package com.kernel.service;

import com.kernel.model.PriceHistory;
import com.kernel.model.Product;
import com.kernel.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final CartItemRepository cartItemRepository;
    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;

    public ProductService(ProductRepository productRepository, 
                          PriceHistoryRepository priceHistoryRepository,
                          CartItemRepository cartItemRepository,
                          ReviewRepository reviewRepository,
                          OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.priceHistoryRepository = priceHistoryRepository;
        this.cartItemRepository = cartItemRepository;
        this.reviewRepository = reviewRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Optional<Product> getProductBySlug(String slug) {
        return productRepository.findBySlug(slug);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue();
    }

    public List<Product> getTrendingProducts() {
        return productRepository.findByIsTrendingTrue();
    }

    public List<Product> filterProducts(String category, String condition, String brand, 
                                       BigDecimal minPrice, BigDecimal maxPrice, String query) {
        return productRepository.filterProducts(category, condition, brand, minPrice, maxPrice, query);
    }

    public List<PriceHistory> getProductPriceHistory(Long productId) {
        return priceHistoryRepository.findByProductIdOrderByRecordedAtAsc(productId);
    }

    @Transactional
    public Product saveProduct(Product product) {
        // 1. Ensure slug exists and is unique
        if (product.getSlug() == null || product.getSlug().trim().isEmpty()) {
            String baseSlug = product.getName() != null 
                    ? product.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "")
                    : "product";
            product.setSlug(baseSlug + "-" + (System.currentTimeMillis() % 100000));
        }

        // 2. Ensure price and originalPrice are sensible
        if (product.getPrice() == null) {
            product.setPrice(BigDecimal.valueOf(9999.00));
        }
        if (product.getOriginalPrice() == null || product.getOriginalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            product.setOriginalPrice(product.getPrice());
        }

        // 3. Compute discount percentage
        if (product.getOriginalPrice().compareTo(product.getPrice()) > 0) {
            BigDecimal diff = product.getOriginalPrice().subtract(product.getPrice());
            int pct = diff.divide(product.getOriginalPrice(), 2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).intValue();
            product.setDiscountPct(pct);
        } else {
            product.setDiscountPct(0);
        }

        // 4. Default fields if missing
        if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
            product.setCategory("Graphics Cards");
        }
        if (product.getBrand() == null || product.getBrand().trim().isEmpty()) {
            product.setBrand("NVIDIA");
        }
        if (product.getConditionType() == null || product.getConditionType().trim().isEmpty()) {
            product.setConditionType("New");
        }
        if (product.getStock() == null) {
            product.setStock(10);
        }
        if (product.getRating() == null) {
            product.setRating(4.8);
        }
        if (product.getReviewCount() == null) {
            product.setReviewCount(0);
        }
        if (product.getWarrantyInfo() == null || product.getWarrantyInfo().trim().isEmpty()) {
            product.setWarrantyInfo("3 Years Brand Warranty");
        }
        if (product.getImageUrl() == null || product.getImageUrl().trim().isEmpty()) {
            product.setImageUrl(getDefaultImageForCategory(product.getCategory()));
        }

        product.setUpdatedAt(LocalDateTime.now());
        Product saved = productRepository.save(product);
        LocalDate today = LocalDate.now();
        PriceHistory todayPrice = priceHistoryRepository.findByProductIdAndRecordedAt(saved.getId(), today)
                .orElseGet(() -> new PriceHistory(saved.getId(), saved.getPrice(), today, "Kernel Marketplace"));
        todayPrice.setPrice(saved.getPrice());
        todayPrice.setSourceTag("Kernel Marketplace");
        if (todayPrice.getId() == null) {
            priceHistoryRepository.save(new PriceHistory(saved.getId(), saved.getPrice(), today, "Kernel Marketplace"));
        } else {
            priceHistoryRepository.save(todayPrice);
        }
        return saved;
    }

    private String getDefaultImageForCategory(String category) {
        if (category == null) return "/src/assets/images/products/rtx-4070-super.svg";
        return switch (category.toLowerCase()) {
            case "cpus", "processors" -> "/src/assets/images/products/ryzen-7-7800x3d.svg";
            case "ram", "memory" -> "/src/assets/images/products/corsair-ddr5-32gb.svg";
            case "storage", "ssd", "nvme" -> "/src/assets/images/products/samsung-980-pro-1tb.svg";
            case "motherboards" -> "/src/assets/images/products/msi-b650-gaming-plus.svg";
            case "cabinets", "cases" -> "/src/assets/images/products/cooler-master-mb520.svg";
            case "power supplies", "psu" -> "/src/assets/images/products/corsair-rm750e.svg";
            case "pc builds" -> "/src/assets/images/products/pc-build-apex.svg";
            default -> "/src/assets/images/products/rtx-4070-super.svg";
        };
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) return;
        if (orderItemRepository.existsByProductId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This product is part of an order and cannot be deleted.");
        }
        cartItemRepository.deleteByProductId(id);
        priceHistoryRepository.deleteByProductId(id);
        reviewRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }
}
