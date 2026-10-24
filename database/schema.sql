-- ========================================================
-- KERNEL - PC Hardware & Services Platform
-- Database Schema for MySQL 8.0+
-- Database: kernel_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS kernel_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE kernel_db;

-- 1. Users Table (Supports Regular User, Agent/B2B, and Admin)
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS repair_tickets;
DROP TABLE IF EXISTS resell_requests;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS price_history;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    phone VARCHAR(25),
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'AGENT', 'ADMIN') DEFAULT 'USER',
    avatar_url VARCHAR(500),
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category ENUM(
        'CPUs', 
        'Graphics Cards', 
        'Motherboards', 
        'RAM', 
        'Storage', 
        'Monitors', 
        'PC Builds', 
        'Power Supplies', 
        'Cabinets', 
        'Coolers', 
        'Accessories'
    ) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model_number VARCHAR(100),
    condition_type ENUM('New', 'Used', 'Refurbished') DEFAULT 'New',
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2) NOT NULL,
    discount_pct INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 10,
    image_url VARCHAR(500) NOT NULL,
    additional_images JSON,
    description TEXT,
    specs_json JSON,
    warranty_info VARCHAR(150) DEFAULT '3 Years Brand Warranty',
    rating DECIMAL(3, 2) DEFAULT 4.8,
    review_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_brand (brand),
    INDEX idx_condition (condition_type),
    INDEX idx_price (price),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Price History Table (For historical & real-time trend charts)
CREATE TABLE price_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    recorded_at DATE NOT NULL,
    source_tag VARCHAR(50) DEFAULT 'Kernel Marketplace',
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_ph_product_date (product_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Cart Items Table
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Orders Table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(60) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(12, 2) DEFAULT 0.00,
    status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PROCESSING',
    payment_method ENUM('UPI', 'CARD', 'NET_BANKING', 'COD') DEFAULT 'UPI',
    payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PAID',
    shipping_name VARCHAR(120),
    shipping_phone VARCHAR(25),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    estimated_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_order_status (status),
    INDEX idx_order_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Order Items Table
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Resell Requests Table (Sell Your Hardware module)
CREATE TABLE resell_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    model_name VARCHAR(255) NOT NULL,
    hardware_condition ENUM('Brand New Sealed', 'Like New', 'Gently Used', 'Heavy Used / Minor Flaw', 'Faulty / For Parts') NOT NULL,
    purchase_year INT,
    has_bill_and_box BOOLEAN DEFAULT TRUE,
    expected_price DECIMAL(12, 2),
    estimated_quote DECIMAL(12, 2),
    status ENUM('SUBMITTED', 'UNDER_REVIEW', 'OFFER_MADE', 'ACCEPTED', 'REJECTED', 'COMPLETED') DEFAULT 'UNDER_REVIEW',
    location_pincode VARCHAR(20),
    city VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Repair Tickets Table (Repair Service module)
CREATE TABLE repair_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(60) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    device_type ENUM('Custom Desktop PC', 'Laptop', 'GPU Card', 'Motherboard', 'PSU / Other') NOT NULL,
    issue_description TEXT NOT NULL,
    status ENUM('PENDING', 'TECHNICIAN_ASSIGNED', 'IN_INSPECTION', 'WAITING_FOR_PARTS', 'REPAIRED', 'CLOSED') DEFAULT 'PENDING',
    service_type ENUM('Doorstep Pickup', 'Carry-in to Service Center', 'On-site Inspection') DEFAULT 'Doorstep Pickup',
    location_pincode VARCHAR(20),
    service_address TEXT,
    assigned_technician VARCHAR(120),
    estimated_repair_cost DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Reviews Table
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(120) DEFAULT 'Verified Buyer',
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
