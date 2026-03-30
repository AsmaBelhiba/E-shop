package org.example.projet_frontend.repositories;

import org.example.projet_frontend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product> findTop4ByOrderByIdDesc();
}
