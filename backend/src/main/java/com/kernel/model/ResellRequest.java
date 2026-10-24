package com.kernel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "resell_requests")
public class ResellRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String category;

    private String brand;

    @Column(name = "model_name", nullable = false)
    private String modelName;

    @Column(name = "hardware_condition", nullable = false)
    private String hardwareCondition; // Brand New Sealed, Like New, Gently Used, Heavy Used / Minor Flaw, Faulty / For Parts

    @Column(name = "purchase_year")
    private Integer purchaseYear;

    @Column(name = "has_bill_and_box")
    private Boolean hasBillAndBox = true;

    @Column(name = "expected_price", precision = 12, scale = 2)
    private BigDecimal expectedPrice;

    @Column(name = "estimated_quote", precision = 12, scale = 2)
    private BigDecimal estimatedQuote;

    private String status = "UNDER_REVIEW"; // SUBMITTED, UNDER_REVIEW, OFFER_MADE, ACCEPTED, REJECTED, COMPLETED

    @Column(name = "location_pincode")
    private String locationPincode;

    private String city;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ResellRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getHardwareCondition() { return hardwareCondition; }
    public void setHardwareCondition(String hardwareCondition) { this.hardwareCondition = hardwareCondition; }

    public Integer getPurchaseYear() { return purchaseYear; }
    public void setPurchaseYear(Integer purchaseYear) { this.purchaseYear = purchaseYear; }

    public Boolean getHasBillAndBox() { return hasBillAndBox; }
    public void setHasBillAndBox(Boolean hasBillAndBox) { this.hasBillAndBox = hasBillAndBox; }

    public BigDecimal getExpectedPrice() { return expectedPrice; }
    public void setExpectedPrice(BigDecimal expectedPrice) { this.expectedPrice = expectedPrice; }

    public BigDecimal getEstimatedQuote() { return estimatedQuote; }
    public void setEstimatedQuote(BigDecimal estimatedQuote) { this.estimatedQuote = estimatedQuote; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLocationPincode() { return locationPincode; }
    public void setLocationPincode(String locationPincode) { this.locationPincode = locationPincode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
