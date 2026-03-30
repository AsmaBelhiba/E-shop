package org.example.projet_frontend.config;

import org.example.projet_frontend.entities.Category;
import org.example.projet_frontend.entities.Product;
import org.example.projet_frontend.repositories.CategoryRepo;
import org.example.projet_frontend.repositories.ProductRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepo categoryRepo;
    private final ProductRepo productRepo;

    public DataInitializer(CategoryRepo categoryRepo, ProductRepo productRepo) {
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        List<Category> existingCategories = categoryRepo.findAll();
        
        Category fashion = getOrCreateCategory(existingCategories, "Fashion");
        Category gaming = getOrCreateCategory(existingCategories, "Gaming");
        Category home = getOrCreateCategory(existingCategories, "Home & Living");
        Category electronics = getOrCreateCategory(existingCategories, "Electronics");
        Category hobbies = getOrCreateCategory(existingCategories, "Hobbies & Toys");
        Category education = getOrCreateCategory(existingCategories, "Education & Books");

        List<Product> existingProducts = productRepo.findAll();
        
        // Fashion - Highly realistic aesthetic clothing
        upsertProduct(existingProducts, "Premium Leather Sneakers", 129.99, fashion, "Sleek, comfortable red leather sneakers suitable for everyday wear. Guaranteed to stand out.", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Designer Aviator Sunglasses", 145.00, fashion, "UV400 protection designer sunglasses featuring a classic aviator frame for sunny days.", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Urban Explorer Canvas Backpack", 89.50, fashion, "Durable canvas backpack suitable for city commuting and weekend getaways. Vintage style.", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80");

        // Gaming
        upsertProduct(existingProducts, "Next-Gen Wireless Controller", 69.99, gaming, "Ergonomic wireless gaming controller providing immersive haptic feedback and dynamic triggers.", "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Portable Gaming Console", 299.00, gaming, "Play your favorite games anywhere with this vibrant handheld console setup.", "https://images.unsplash.com/photo-1507764923504-cd9025fa5272?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Mechanical RGB Keyboard", 129.99, gaming, "Tactile mechanical switches with customizable RGB backlighting and programmable macros.", "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80");

        // Home & Living
        upsertProduct(existingProducts, "Matte Ceramic Coffee Mug", 24.99, home, "Handcrafted ceramic mug with a matte finish. Perfect for your morning espresso or tea.", "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Mid-Century Modern Sofa", 899.00, home, "Elegant and comfortable living room couch featuring premium fabric and sturdy wooden legs.", "https://images.unsplash.com/photo-1493663284031-b5e08d669bfe?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Minimalist Desk Lamp", 45.00, home, "Sleek and highly adjustable desk lamp providing perfect illumination for your home office workspace.", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80");

        // Electronics
        upsertProduct(existingProducts, "Noise-Cancelling Over-Ear Headphones", 249.99, electronics, "Industry-leading active noise cancellation with 30-hour battery life and premium high-fidelity sound.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Classic Chronograph Smartwatch", 199.99, electronics, "Elegant smartwatch that seamlessly blends classic timepiece design with modern health tracking.", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Vintage Film Camera", 349.00, electronics, "Capture timeless memories with this classic aesthetic vintage-style analog camera.", "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80");

        // Hobbies & Toys
        upsertProduct(existingProducts, "Professional Speed Cube", 19.99, hobbies, "Competition-grade speed cube with smooth magnetic cornering and vibrant stickerless design.", "https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Creative Building Blocks Set", 49.50, hobbies, "Unleash your creativity with this massive set of colorful, interlocking building blocks.", "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Pro Street Skateboard", 85.00, hobbies, "High-performance skateboard complete with durable grip tape and smooth urethane wheels.", "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?auto=format&fit=crop&w=800&q=80");
        
        // Education & Books
        upsertProduct(existingProducts, "Premium Dotted Hardcover Notebook", 18.50, education, "Luxurious dotted hardcover notebook perfect for journaling, sketching, and professional note-taking.", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Vintage Literature Collection", 65.00, education, "Beautifully bound hardcover classics to elevate your bookshelf with timeless stories.", "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80");
        upsertProduct(existingProducts, "Antique Study Globe", 45.99, education, "Detailed educational globe featuring antique cartography on a sturdy wooden and bronze base.", "https://images.unsplash.com/photo-1589561253898-768105ca91a8?auto=format&fit=crop&w=800&q=80");
    }

    private Category getOrCreateCategory(List<Category> existingCategories, String name) {
        return existingCategories.stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    Category cat = new Category();
                    cat.setName(name);
                    return categoryRepo.save(cat);
                });
    }

    private void upsertProduct(List<Product> existingProducts, String name, double price, Category category, String description, String imageUrl) {
        // Collect all products that match this name to identify duplicates
        List<Product> matches = existingProducts.stream()
                .filter(p -> p.getName().equalsIgnoreCase(name))
                .collect(Collectors.toList());
        
        Product product;
        if (matches.isEmpty()) {
            product = new Product();
        } else {
            product = matches.get(0); // Take the first one
            // Clean up any extra duplicates of the same exact name
            if (matches.size() > 1) {
                for (int i = 1; i < matches.size(); i++) {
                    try {
                        productRepo.delete(matches.get(i));
                    } catch (Exception e) {
                        // ignore if constrained
                    }
                }
            }
        }
        
        product.setName(name);
        product.setPrice(price);
        product.setCategory(category);
        product.setDescription(description);
        product.setImageUrl(imageUrl);
        productRepo.save(product);
    }
}
