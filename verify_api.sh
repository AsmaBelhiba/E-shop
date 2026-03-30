# Verification Script for Product and Category APIs

echo "Testing Category API..."
# 1. Create Category
curl -X POST http://localhost:8080/api/categories \
     -H "Content-Type: application/json" \
     -d '{"name": "Electronics"}'

# 2. List Categories
curl -X GET http://localhost:8080/api/categories

echo -e "\n\nTesting Product API..."
# 3. Create Product
curl -X POST http://localhost:8080/api/products \
     -H "Content-Type: application/json" \
     -d '{"name": "Laptop", "price": 1200.0, "description": "High performance laptop", "category": {"id": 1}}'

# 4. List Products
curl -X GET http://localhost:8080/api/products

# 5. Get Product by ID
curl -X GET http://localhost:8080/api/products/1

# 6. Update Product
curl -X PUT http://localhost:8080/api/products/1 \
     -H "Content-Type: application/json" \
     -d '{"name": "Gaming Laptop", "price": 1500.0, "description": "Ultra gaming laptop"}'

# 7. Delete Product
# curl -X DELETE http://localhost:8080/api/products/1

echo -e "\n\nVerification Complete."
