package org.example.projet_frontend.controllers;

import org.example.projet_frontend.entities.Supplier;
import org.example.projet_frontend.repositories.SupplierRepo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierRepo supplierRepo;

    public SupplierController(SupplierRepo supplierRepo) {
        this.supplierRepo = supplierRepo;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepo.findAll();
    }

    @GetMapping("/count")
    public long getSupplierCount() {
        return supplierRepo.count();
    }

    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable Long id) {
        return supplierRepo.findById(id).orElse(null);
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return supplierRepo.save(supplier);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id, @RequestBody Supplier supplierDetails) {
        Supplier supplier = supplierRepo.findById(id).orElse(null);
        if (supplier != null) {
            supplier.setName(supplierDetails.getName());
            supplier.setEmail(supplierDetails.getEmail());
            supplier.setPhoneNumber(supplierDetails.getPhoneNumber());
            supplier.setAddress(supplierDetails.getAddress());
            return supplierRepo.save(supplier);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        supplierRepo.deleteById(id);
    }
}
