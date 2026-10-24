package com.kernel.controller;

import com.kernel.model.Order;
import com.kernel.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(orderService.getOrdersByUser(userId));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        return orderService.getOrderByNumber(orderNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestBody CheckoutRequest request) {
        Order order = orderService.placeOrder(
                request.getUserId(),
                request.getShippingName(),
                request.getShippingPhone(),
                request.getShippingAddress(),
                request.getShippingCity(),
                request.getShippingPostalCode(),
                request.getPaymentMethod(),
                request.getItems()
        );
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || !List.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED").contains(status)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    public static class CheckoutRequest {
        private Long userId;
        private String shippingName;
        private String shippingPhone;
        private String shippingAddress;
        private String shippingCity;
        private String shippingPostalCode;
        private String paymentMethod;
        private List<OrderService.OrderItemRequest> items;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getShippingName() { return shippingName; }
        public void setShippingName(String shippingName) { this.shippingName = shippingName; }
        public String getShippingPhone() { return shippingPhone; }
        public void setShippingPhone(String shippingPhone) { this.shippingPhone = shippingPhone; }
        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
        public String getShippingCity() { return shippingCity; }
        public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }
        public String getShippingPostalCode() { return shippingPostalCode; }
        public void setShippingPostalCode(String shippingPostalCode) { this.shippingPostalCode = shippingPostalCode; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public List<OrderService.OrderItemRequest> getItems() { return items; }
        public void setItems(List<OrderService.OrderItemRequest> items) { this.items = items; }
    }
}
