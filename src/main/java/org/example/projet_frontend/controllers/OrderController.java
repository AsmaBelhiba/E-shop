package org.example.projet_frontend.controllers;

import org.example.projet_frontend.entities.Order;
import org.example.projet_frontend.entities.OrderItem;
import org.example.projet_frontend.entities.User;
import org.example.projet_frontend.repositories.OrderRepo;
import org.example.projet_frontend.repositories.UserRepo;
import org.example.projet_frontend.config.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmailService emailService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody List<OrderItem> items) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow();

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());

        double total = 0;
        for (OrderItem item : items) {
            item.setOrder(order);
            total += item.getPrice() * item.getQuantity();
        }
        order.setItems(items);
        order.setTotalAmount(total);

        // Delivery Fee Calculation: Free for orders > $200
        double deliveryFees = (total > 200) ? 0 : 10.0;
        order.setDeliveryFees(deliveryFees);
        order.setPaymentType("Cash on delivery");

        orderRepo.save(order);

        // Send Confirmation Email
        emailService.sendOrderConfirmationEmail(order);

        return ResponseEntity.ok(order);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(orderRepo.findByUser(user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepo.findAll());
    }
}
