package org.example.projet_frontend.repositories;

import org.example.projet_frontend.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category, Long> {
}
