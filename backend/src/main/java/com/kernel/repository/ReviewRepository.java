package com.kernel.repository;

import com.kernel.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Modifying
    @Query("DELETE FROM Review r WHERE r.productId = :productId")
    void deleteByProductId(@Param("productId") Long productId);

    @Modifying
    @Query("DELETE FROM Review r WHERE r.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
