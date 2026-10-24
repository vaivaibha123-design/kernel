package com.kernel.repository;

import com.kernel.model.ResellRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResellRequestRepository extends JpaRepository<ResellRequest, Long> {
    List<ResellRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ResellRequest> findByStatusOrderByCreatedAtDesc(String status);
}
