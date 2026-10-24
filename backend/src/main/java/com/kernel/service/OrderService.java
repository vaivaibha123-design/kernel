package com.kernel.service;

import com.kernel.model.Order;
import com.kernel.model.OrderItem;
import com.kernel.model.Product;
import com.kernel.repository.CartItemRepository;
import com.kernel.repository.OrderRepository;
import com.kernel.repository.ProductRepository;
import com.kernel.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
                        CartItemRepository cartItemRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    @Transactional
    public Order placeOrder(Long userId, String shippingName, String shippingPhone, 
                           String shippingAddress, String shippingCity, String shippingPostalCode,
                           String paymentMethod, List<OrderItemRequest> itemRequests) {
        if (userId == null || !userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        if (itemRequests == null || itemRequests.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot place an order with an empty cart.");
        }
        if (shippingName == null || shippingName.isBlank() || shippingPhone == null || shippingPhone.isBlank()
                || shippingAddress == null || shippingAddress.isBlank() || shippingCity == null || shippingCity.isBlank()
                || shippingPostalCode == null || shippingPostalCode.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Complete shipping contact and address details are required.");
        }
        if (paymentMethod != null && !List.of("UPI", "CARD", "NET_BANKING", "COD").contains(paymentMethod)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported payment method.");
        }

        Order order = new Order();
        String generatedOrderNumber = "HR" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        order.setOrderNumber(generatedOrderNumber);
        order.setUserId(userId);
        order.setShippingName(shippingName);
        order.setShippingPhone(shippingPhone);
        order.setShippingAddress(shippingAddress);
        order.setShippingCity(shippingCity);
        order.setShippingPostalCode(shippingPostalCode);
        order.setPaymentMethod(paymentMethod != null ? paymentMethod : "UPI");
        order.setPaymentStatus("PENDING");
        order.setStatus("PROCESSING");
        order.setEstimatedDelivery(LocalDate.now().plusDays(4));
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest req : itemRequests) {
            if (req.getProductId() == null || req.getQuantity() == null || req.getQuantity() < 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each order item needs a product and a positive quantity.");
            }
            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with id: " + req.getProductId()));

            OrderItem orderItem = new OrderItem(order, product, req.getQuantity(), product.getPrice());
            order.getItems().add(orderItem);
            total = total.add(orderItem.getTotalPrice());

            if (product.getStock() == null || product.getStock() < req.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient stock for " + product.getName() + ".");
            }
            product.setStock(product.getStock() - req.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(total);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO); // Free shipping

        Order saved = orderRepository.save(order);

        // Clear user's cart
        cartItemRepository.deleteByUserId(userId);

        return saved;
    }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        if (newStatus == null || !List.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED").contains(newStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported order status.");
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found."));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
