package org.example.projet_frontend.repositories;

import org.example.projet_frontend.entities.Order;
import org.example.projet_frontend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
