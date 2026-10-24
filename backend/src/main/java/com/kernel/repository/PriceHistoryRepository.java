package com.kernel.repository;

import com.kernel.model.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
    List<PriceHistory> findByProductIdOrderByRecordedAtAsc(Long productId);
    Optional<PriceHistory> findByProductIdAndRecordedAt(Long productId, LocalDate recordedAt);

    @Modifying
    @Query("DELETE FROM PriceHistory ph WHERE ph.productId = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}
