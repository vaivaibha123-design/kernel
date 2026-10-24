package com.kernel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "repair_tickets")
public class RepairTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_number", nullable = false, unique = true)
    private String ticketNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "device_type", nullable = false)
    private String deviceType; // Custom Desktop PC, Laptop, GPU Card, Motherboard, PSU / Other

    @Column(name = "issue_description", nullable = false, columnDefinition = "TEXT")
    private String issueDescription;

    private String status = "PENDING"; // PENDING, TECHNICIAN_ASSIGNED, IN_INSPECTION, WAITING_FOR_PARTS, REPAIRED, CLOSED

    @Column(name = "service_type")
    private String serviceType = "Doorstep Pickup";

    @Column(name = "location_pincode")
    private String locationPincode;

    @Column(name = "service_address", columnDefinition = "TEXT")
    private String serviceAddress;

    @Column(name = "assigned_technician")
    private String assignedTechnician;

    @Column(name = "estimated_repair_cost", precision = 12, scale = 2)
    private BigDecimal estimatedRepairCost;

    private LocalDateTime createdAt = LocalDateTime.now();

    public RepairTicket() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getLocationPincode() { return locationPincode; }
    public void setLocationPincode(String locationPincode) { this.locationPincode = locationPincode; }

    public String getServiceAddress() { return serviceAddress; }
    public void setServiceAddress(String serviceAddress) { this.serviceAddress = serviceAddress; }

    public String getAssignedTechnician() { return assignedTechnician; }
    public void setAssignedTechnician(String assignedTechnician) { this.assignedTechnician = assignedTechnician; }

    public BigDecimal getEstimatedRepairCost() { return estimatedRepairCost; }
    public void setEstimatedRepairCost(BigDecimal estimatedRepairCost) { this.estimatedRepairCost = estimatedRepairCost; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
