package org.example.projet_frontend.controllers;

import org.example.projet_frontend.entities.Category;
import org.example.projet_frontend.repositories.CategoryRepo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    private final CategoryRepo categoryRepo;

    public CategoryController(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    @GetMapping("/count")
    public long getCategoryCount() {
        return categoryRepo.count();
    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {
        return categoryRepo.findById(id).orElse(null);
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryRepo.save(category);
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        Category category = categoryRepo.findById(id).orElse(null);
        if (category != null) {
            category.setName(categoryDetails.getName());
            return categoryRepo.save(category);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryRepo.deleteById(id);
    }
}
