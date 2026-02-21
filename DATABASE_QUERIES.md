# Database Queries for Pizza App

## Database Configuration

- **Database**: MySQL
- **Configuration**: `lib/db.js` using mysql2 pool

---

## Required Database Schema

```
sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Coupons table
CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('percentage', 'fixed') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  min_order DECIMAL(10,2) DEFAULT 0,
  expiry DATE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## All Database Queries Used in the Project

### 1. Users Table Queries

```
sql
-- Check if user exists
SELECT id FROM users WHERE email = ?

-- Register new user
INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')

-- Register admin
INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)

-- User login
SELECT * FROM users WHERE email = ?

-- Admin login
SELECT * FROM users WHERE email = ? AND role = 'admin'

-- Get all users
SELECT id, name, email FROM users WHERE role='user'

-- Get users count
SELECT COUNT(*) as total FROM users WHERE role='user'
```

### 2. Products Table Queries

```
sql
-- Get all products
SELECT id, name, description, price, image FROM products ORDER BY id DESC

-- Get single product
SELECT * FROM products WHERE id = ?

-- Add new product
INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)

-- Update product (with image)
UPDATE products SET name=?, description=?, price=?, category=?, image=? WHERE id=?

-- Update product (without image)
UPDATE products SET name=?, description=?, price=?, category=? WHERE id=?

-- Delete product
DELETE FROM products WHERE id = ?

-- Get products count
SELECT COUNT(*) as total FROM products
```

### 3. Orders Table Queries

```
sql
-- Get all orders
SELECT * FROM orders ORDER BY created_at DESC

-- Get user orders
SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC

-- Create order
INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)

-- Update order status
UPDATE orders SET status = ? WHERE id = ? AND user_id = ?

-- Confirm order payment
UPDATE orders SET payment_status = 'paid', status = 'Confirmed' WHERE id = ?

-- Get order status
SELECT status FROM orders WHERE id = ? AND user_id = ?

-- Delete order
DELETE FROM orders WHERE id = ?

-- Get orders count
SELECT COUNT(*) as total FROM orders

-- Revenue (Delivered orders)
SELECT SUM(total) as total FROM orders WHERE status='Delivered'

-- Delivered orders
SELECT id, total, created_at FROM orders WHERE status='Delivered'

-- Get order details with items
SELECT o.*, p.name, p.image, oi.quantity, oi.price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = ?
```

### 4. Order Items Table Queries

```
sql
-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?

-- Delete order items
DELETE FROM order_items WHERE order_id = ?

-- Get order items summary
SELECT p.name, SUM(oi.quantity) as total_quantity, SUM(oi.price * oi.quantity) as total_price
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.name
```

### 5. Coupons Table Queries

```
sql
-- Get all active coupons
SELECT code, type, value, min_order FROM coupons WHERE status='active' AND (expiry IS NULL OR expiry >= CURDATE())

-- Get coupon by code
SELECT * FROM coupons WHERE code=? AND status='active' AND (expiry IS NULL OR expiry >= CURDATE())

-- Get all coupons
SELECT * FROM coupons ORDER BY id DESC

-- Create coupon
INSERT INTO coupons (code, type, value, min_order, expiry, status) VALUES (?, ?, ?, ?, ?, ?)

-- Update coupon status
UPDATE coupons SET status=? WHERE id=?

-- Delete coupon
DELETE FROM coupons WHERE id=?
```

### 6. Dashboard Queries

```
sql
-- Users count
SELECT COUNT(*) as total FROM users WHERE role='user'

-- Orders count
SELECT COUNT(*) as total FROM orders

-- Products count
SELECT COUNT(*) as total FROM products

-- Revenue
SELECT SUM(total) as total FROM orders WHERE status='Delivered'

-- All users
SELECT id, name, email FROM users WHERE role='user'

-- All orders
SELECT id, user_id, total, status, created_at FROM orders ORDER BY created_at DESC

-- All products
SELECT id, name, price FROM products

-- Delivered orders
SELECT id, total, created_at FROM orders WHERE status='Delivered'
```

### 7. Test Connection Query

```
sql
SELECT 1 AS test
```
