package com.kernel.controller;

import com.kernel.model.*;
import com.kernel.repository.*;
import com.kernel.service.UserAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ResellRequestRepository resellRequestRepository;
    private final RepairTicketRepository repairTicketRepository;
    private final UserAccountService userAccountService;

    public AdminController(ProductRepository productRepository, 
                           OrderRepository orderRepository, 
                           UserRepository userRepository,
                           ResellRequestRepository resellRequestRepository,
                           RepairTicketRepository repairTicketRepository,
                           UserAccountService userAccountService) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.resellRequestRepository = resellRequestRepository;
        this.repairTicketRepository = repairTicketRepository;
        this.userAccountService = userAccountService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<Product> products = productRepository.findAll();
        List<Order> orders = orderRepository.findAll();
        List<User> users = userRepository.findAll();
        List<ResellRequest> resellRequests = resellRequestRepository.findAll();
        List<RepairTicket> repairTickets = repairTicketRepository.findAll();

        BigDecimal totalRevenue = orders.stream()
                .filter(order -> "PAID".equals(order.getPaymentStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long lowStockCount = products.stream().filter(p -> p.getStock() != null && p.getStock() <= 5).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", products.size());
        stats.put("totalUsers", users.size());
        stats.put("totalRevenue", totalRevenue);
        stats.put("lowStockCount", lowStockCount);
        stats.put("recentOrders", orders);
        stats.put("products", products);
        stats.put("users", users);
        stats.put("resellRequests", resellRequests);
        stats.put("repairTickets", repairTickets);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String role = payload.get("role");
        if (role == null || !List.of("USER", "AGENT", "ADMIN").contains(role)) {
            return ResponseEntity.badRequest().build();
        }
        return userRepository.findById(id)
                .map(u -> {
                    u.setRole(role);
                    return ResponseEntity.ok(userRepository.save(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> {
                    u.setIsActive(u.getIsActive() == null || !u.getIsActive());
                    return ResponseEntity.ok(userRepository.save(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userAccountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || !List.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED").contains(status)) {
            return ResponseEntity.badRequest().build();
        }
        return orderRepository.findById(id)
                .map(o -> {
                    o.setStatus(status);
                    return ResponseEntity.ok(orderRepository.save(o));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/resell/{id}/status")
    public ResponseEntity<ResellRequest> updateResellStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || !List.of("SUBMITTED", "UNDER_REVIEW", "OFFER_MADE", "ACCEPTED", "REJECTED", "COMPLETED").contains(status)) {
            return ResponseEntity.badRequest().build();
        }
        return resellRequestRepository.findById(id)
                .map(r -> {
                    r.setStatus(status);
                    return ResponseEntity.ok(resellRequestRepository.save(r));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/repair/{id}/status")
    public ResponseEntity<RepairTicket> updateRepairStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || !List.of("PENDING", "TECHNICIAN_ASSIGNED", "IN_INSPECTION", "WAITING_FOR_PARTS", "REPAIRED", "CLOSED").contains(status)) {
            return ResponseEntity.badRequest().build();
        }
        return repairTicketRepository.findById(id)
                .map(ticket -> {
                    ticket.setStatus(status);
                    return ResponseEntity.ok(repairTicketRepository.save(ticket));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
