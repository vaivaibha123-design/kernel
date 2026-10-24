package com.kernel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "price_history")
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "recorded_at", nullable = false)
    private LocalDate recordedAt;

    @Column(name = "source_tag")
    private String sourceTag = "Kernel Marketplace";

    public PriceHistory() {}

    public PriceHistory(Long productId, BigDecimal price, LocalDate recordedAt, String sourceTag) {
        this.productId = productId;
        this.price = price;
        this.recordedAt = recordedAt;
        this.sourceTag = sourceTag;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public LocalDate getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDate recordedAt) { this.recordedAt = recordedAt; }

    public String getSourceTag() { return sourceTag; }
    public void setSourceTag(String sourceTag) { this.sourceTag = sourceTag; }
}
