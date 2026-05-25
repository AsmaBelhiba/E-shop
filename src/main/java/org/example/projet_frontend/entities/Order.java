package org.example.projet_frontend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User is mandatory")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Total amount is mandatory")
    @Min(value = 0, message = "Total amount must be greater than or equal to 0")
    private Double totalAmount;

    @NotNull(message = "Order date is mandatory")
    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @NotNull(message = "Delivery fees are mandatory")
    @Min(value = 0, message = "Delivery fees must be greater than or equal to 0")
    private Double deliveryFees;

    @NotBlank(message = "Payment type is mandatory")
    private String paymentType;
}
