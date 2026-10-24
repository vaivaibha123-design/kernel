package com.kernel.service;

import com.kernel.model.RepairTicket;
import com.kernel.model.ResellRequest;
import com.kernel.repository.RepairTicketRepository;
import com.kernel.repository.ResellRequestRepository;
import com.kernel.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.Set;

@Service
public class ResellService {

    private final ResellRequestRepository resellRequestRepository;
    private final RepairTicketRepository repairTicketRepository;
    private final UserRepository userRepository;

    public ResellService(ResellRequestRepository resellRequestRepository, RepairTicketRepository repairTicketRepository,
                         UserRepository userRepository) {
        this.resellRequestRepository = resellRequestRepository;
        this.repairTicketRepository = repairTicketRepository;
        this.userRepository = userRepository;
    }

    public List<ResellRequest> getResellRequestsByUser(Long userId) {
        return resellRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<ResellRequest> getAllResellRequests() {
        return resellRequestRepository.findAll();
    }

    public ResellRequest submitResellRequest(ResellRequest request) {
        if (request.getUserId() == null || !userRepository.existsById(request.getUserId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        if (request.getModelName() == null || request.getModelName().isBlank()
                || request.getCategory() == null || request.getCategory().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category and model name are required.");
        }
        if (request.getHardwareCondition() == null
                || !Set.of("Brand New Sealed", "Like New", "Gently Used", "Heavy Used / Minor Flaw", "Faulty / For Parts")
                .contains(request.getHardwareCondition())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported hardware condition.");
        }
        // Instant automated valuation algorithm
        BigDecimal quote = calculateValuation(request);
        request.setEstimatedQuote(quote);
        request.setStatus("UNDER_REVIEW");
        return resellRequestRepository.save(request);
    }

    private BigDecimal calculateValuation(ResellRequest req) {
        if (req.getExpectedPrice() != null && req.getExpectedPrice().compareTo(BigDecimal.ZERO) > 0) {
            // Give estimated offer at ~90-95% of expected if reasonable
            return req.getExpectedPrice().multiply(BigDecimal.valueOf(0.92));
        }
        return BigDecimal.valueOf(15000.00); // Standard base quote
    }

    public RepairTicket bookRepairTicket(RepairTicket ticket) {
        if (ticket.getUserId() == null || !userRepository.existsById(ticket.getUserId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        if (ticket.getIssueDescription() == null || ticket.getIssueDescription().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Issue description is required.");
        }
        if (ticket.getDeviceType() == null
                || !Set.of("Custom Desktop PC", "Laptop", "GPU Card", "Motherboard", "PSU / Other")
                .contains(ticket.getDeviceType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported repair device type.");
        }
        String ticketNum = "KRN-REP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
        ticket.setTicketNumber(ticketNum);
        ticket.setStatus("PENDING");
        ticket.setEstimatedRepairCost(BigDecimal.valueOf(499.00));
        return repairTicketRepository.save(ticket);
    }

    public List<RepairTicket> getRepairTicketsByUser(Long userId) {
        return repairTicketRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<RepairTicket> getAllRepairTickets() {
        return repairTicketRepository.findAll();
    }
}
