package com.kernel.repository;

import com.kernel.model.RepairTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepairTicketRepository extends JpaRepository<RepairTicket, Long> {
    List<RepairTicket> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<RepairTicket> findByTicketNumber(String ticketNumber);
    List<RepairTicket> findByStatusOrderByCreatedAtDesc(String status);
}
