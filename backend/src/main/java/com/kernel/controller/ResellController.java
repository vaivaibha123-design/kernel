package com.kernel.controller;

import com.kernel.model.RepairTicket;
import com.kernel.model.ResellRequest;
import com.kernel.service.ResellService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ResellController {

    private final ResellService resellService;

    public ResellController(ResellService resellService) {
        this.resellService = resellService;
    }

    @PostMapping("/resell")
    public ResponseEntity<ResellRequest> submitResell(@RequestBody ResellRequest request) {
        return ResponseEntity.ok(resellService.submitResellRequest(request));
    }

    @GetMapping("/resell")
    public ResponseEntity<List<ResellRequest>> getResellRequests(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(resellService.getResellRequestsByUser(userId));
        }
        return ResponseEntity.ok(resellService.getAllResellRequests());
    }

    @PostMapping("/repair")
    public ResponseEntity<RepairTicket> bookRepair(@RequestBody RepairTicket ticket) {
        return ResponseEntity.ok(resellService.bookRepairTicket(ticket));
    }

    @GetMapping("/repair")
    public ResponseEntity<List<RepairTicket>> getRepairTickets(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(resellService.getRepairTicketsByUser(userId));
        }
        return ResponseEntity.ok(resellService.getAllRepairTickets());
    }
}
