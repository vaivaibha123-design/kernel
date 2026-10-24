package com.kernel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String brand;

    private String modelNumber;

    @Column(name = "condition_type")
    private String conditionType = "New"; // New, Used, Refurbished

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal originalPrice;

    private Integer discountPct = 0;

    private Integer stock = 10;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "specs_json", columnDefinition = "TEXT")
    private String specsJson;

    private String warrantyInfo = "3 Years Brand Warranty";

    private Double rating = 4.8;

    private Integer reviewCount = 0;

    private Boolean isFeatured = false;

    private Boolean isTrending = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Product() {}

    public Product(String name, String slug, String category, String brand, String conditionType,
                   BigDecimal price, BigDecimal originalPrice, Integer discountPct, Integer stock,
                   String imageUrl, String description, String specsJson, Boolean isFeatured, Boolean isTrending) {
        this.name = name;
        this.slug = slug;
        this.category = category;
        this.brand = brand;
        this.conditionType = conditionType;
        this.price = price;
        this.originalPrice = originalPrice;
        this.discountPct = discountPct;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.description = description;
        this.specsJson = specsJson;
        this.isFeatured = isFeatured;
        this.isTrending = isTrending;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModelNumber() { return modelNumber; }
    public void setModelNumber(String modelNumber) { this.modelNumber = modelNumber; }

    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public Integer getDiscountPct() { return discountPct; }
    public void setDiscountPct(Integer discountPct) { this.discountPct = discountPct; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSpecsJson() { return specsJson; }
    public void setSpecsJson(String specsJson) { this.specsJson = specsJson; }

    public String getWarrantyInfo() { return warrantyInfo; }
    public void setWarrantyInfo(String warrantyInfo) { this.warrantyInfo = warrantyInfo; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsTrending() { return isTrending; }
    public void setIsTrending(Boolean isTrending) { this.isTrending = isTrending; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
