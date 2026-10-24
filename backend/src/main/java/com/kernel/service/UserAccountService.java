package com.kernel.service;

import com.kernel.model.Order;
import com.kernel.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserAccountService {

    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final ResellRequestRepository resellRequestRepository;
    private final RepairTicketRepository repairTicketRepository;
    private final ReviewRepository reviewRepository;

    public UserAccountService(UserRepository userRepository, CartItemRepository cartItemRepository,
                              OrderRepository orderRepository, ResellRequestRepository resellRequestRepository,
                              RepairTicketRepository repairTicketRepository, ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.resellRequestRepository = resellRequestRepository;
        this.repairTicketRepository = repairTicketRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public void deleteAccount(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }

        cartItemRepository.deleteByUserId(userId);
        orderRepository.deleteAll(orderRepository.findByUserIdOrderByCreatedAtDesc(userId));
        resellRequestRepository.deleteAll(resellRequestRepository.findByUserIdOrderByCreatedAtDesc(userId));
        repairTicketRepository.deleteAll(repairTicketRepository.findByUserIdOrderByCreatedAtDesc(userId));
        reviewRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }
}
