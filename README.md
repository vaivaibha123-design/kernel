# 🚀 KERNEL - PC Hardware, Marketplace, PC Builder & Repair Platform

Kernel is a production-ready, full-stack e-commerce, custom PC builder, resale, and hardware repair platform built with **React (Vite + Tailwind CSS)** on the frontend and **Java (Spring Boot 3 REST API)** on the backend, connected to **MySQL**.

---

## 📸 Implemented Screens (Matching Design Board)

1. **Home Page**: Hero banner ("Your One Stop Hardware Marketplace"), Category pills (CPUs, GPUs, RAM, Motherboards, Storage, Monitors, PC Builds, Accessories), Featured Deals grid with live ₹ prices, Trending pre-owned deals, and trust badges.
2. **Catalog Page**: Left sidebar filters (Category checkboxes, Condition: New/Used/Refurbished, Brand: AMD/NVIDIA/ASUS/MSI/Gigabyte, Price Range slider), Sort by dropdown, Product cards with "+ Add to Cart".
3. **Product Detail Page (PDP)**: Multi-angle image thumbnails, specs highlights, trust badges (7 Days Replacement, 3 Years Brand Warranty, Secure Payment), Description, Specs, Reviews, and an **Interactive Recharts 6-Month Price Trend Graph** (tracking GPU and RAM market fluctuations).
4. **Build Your Dream PC (PC Builder)**: 7-part compatibility configurator (CPU, Motherboard, RAM, Storage, GPU, Case, PSU), live estimated build cost (\(₹\)1,30,493), part swap modal, wattage calculations, and compatibility badges.
5. **Cart Page**: Item quantity modifiers (- 1 +), subtotal (\(₹\)75,497), remove buttons, and instant checkout link.
6. **3-Step Checkout Flow**: 1 Shipping Address, 2 Payment Options (UPI: Google Pay/PhonePe/Paytm, Credit/Debit Card, Net Banking, COD), 3 Review & Place Order.
7. **My Orders & Order Tracking**: Status filter tabs (All, Processing, Shipped, Delivered, Canceled), Order cards with order numbers (#HR123456), and visual shipment tracking milestones.
8. **Sell Your Hardware (Resell & Repair Portal)**: Component specs input, condition assessment, instant automated cash valuation estimate, and doorstep repair technician scheduling.
9. **My Profile & Delivery Addresses**: Profile editor, personal information, delivery addresses (Mumbai, etc.), and quick navigation.
10. **Admin & Seller Dashboards**: Sales revenue (\(₹\)12,48,630), total products (2,548), registered users (8,420), sales trend charts, and warehouse inventory stock alert management.
11. **Google Gemini AI Assistant Widget**: Floating AI chatbot button in the bottom right corner capable of answering hardware questions, verifying socket/motherboard compatibility, bottleneck analysis, and troubleshooting.
12. **Customizable Blank Logo Slot**: Built with a dedicated placeholder slot in `LogoPlaceholder.jsx` ready for you to insert your custom logo image.

---

## 🛠️ Tech Stack & Directory Structure

```
hardhub/ (or kernel/)
├── database/
│   ├── schema.sql           # Complete MySQL 8.0+ schema definitions
│   └── seed_data.sql        # Initial products, users, orders, price history
├── backend/                 # Java Spring Boot 3 REST API (Port 8080)
│   ├── pom.xml
│   ├── src/main/resources/application.properties
│   └── src/main/java/com/kernel/
│       ├── KernelApplication.java
│       ├── controller/      # Product, Order, Cart, Resell, AI, Auth, Admin
│       ├── model/           # JPA Entities (Product, User, Order, etc.)
│       ├── repository/      # Spring Data JPA Repositories
│       ├── service/         # Business logic & Gemini AI client
│       └── config/          # CORS & automatic DataInitializer seeder
└── frontend/                # React + Vite + Tailwind CSS (Port 5173)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── src/
        ├── assets/images/products/  # High-res SVG product illustrations
        ├── components/              # Navbar, Footer, LogoPlaceholder, AI Widget, Auth
        ├── pages/                   # Home, Catalog, PDP, Builder, Cart, Checkout, etc.
        ├── context/                 # AuthContext (Role Switcher), CartContext
        └── data/                    # Initial rich products catalog
```

---

## 📋 Step-by-Step Setup Instructions

### Step 1: MySQL Database Setup
Open MySQL Workbench or the MySQL command-line client. The backend connects to the local MySQL database `kernel_db`. To create the database if it does not exist, run:

```sql
CREATE DATABASE IF NOT EXISTS kernel_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

If `kernel_db` already contains your application tables or data, keep them and do not run `database/schema.sql`. That script drops and recreates the tables. For a **new, empty database only**, you may initialize it with the SQL scripts in `database/`:

```bash
mysql -u root -p kernel_db < database/schema.sql
mysql -u root -p kernel_db < database/seed_data.sql
```

> **Note:** The backend uses Hibernate `ddl-auto=update` to apply compatible schema changes. On startup, `DataInitializer` may add sample users, products, or orders only when the corresponding table is empty.

### Verify the Database (Read-Only SQL)

Run these queries in MySQL Workbench after selecting `kernel_db`. They only read data; they do not add, edit, or delete records. The user query intentionally omits password values.

```sql
USE kernel_db;

-- Confirm the expected tables exist.
SHOW TABLES;

-- Count records in each application table.
SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'price_history', COUNT(*) FROM price_history
UNION ALL SELECT 'cart_items', COUNT(*) FROM cart_items
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'resell_requests', COUNT(*) FROM resell_requests
UNION ALL SELECT 'repair_tickets', COUNT(*) FROM repair_tickets
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews;

-- Accounts (never select the password column).
SELECT id, full_name, email, role, is_active, created_at
FROM users
ORDER BY id;

-- Product catalog and inventory.
SELECT id, name, category, brand, price, stock, is_featured, is_trending
FROM products
ORDER BY id;

-- Price-history records with their product names.
SELECT ph.id, p.name AS product_name, ph.price, ph.recorded_at, ph.source_tag
FROM price_history AS ph
JOIN products AS p ON p.id = ph.product_id
ORDER BY ph.recorded_at DESC, ph.id DESC;

-- Current cart contents with account and product details.
SELECT u.email, p.name AS product_name, c.quantity, p.price,
       c.quantity * p.price AS current_line_total
FROM cart_items AS c
JOIN users AS u ON u.id = c.user_id
JOIN products AS p ON p.id = c.product_id
ORDER BY u.email, p.name;

-- Orders and their line items.
SELECT o.order_number, u.email, o.status, o.payment_status,
       o.total_amount, oi.product_name, oi.quantity, oi.unit_price, oi.total_price
FROM orders AS o
JOIN users AS u ON u.id = o.user_id
LEFT JOIN order_items AS oi ON oi.order_id = o.id
ORDER BY o.created_at DESC, o.order_number;

-- Resale submissions.
SELECT r.id, u.email, r.category, r.brand, r.model_name,
       r.hardware_condition, r.expected_price, r.estimated_quote, r.status
FROM resell_requests AS r
JOIN users AS u ON u.id = r.user_id
ORDER BY r.created_at DESC;

-- Repair tickets.
SELECT t.ticket_number, u.email, t.device_type, t.status,
       t.service_type, t.estimated_repair_cost, t.created_at
FROM repair_tickets AS t
JOIN users AS u ON u.id = t.user_id
ORDER BY t.created_at DESC;

-- Product reviews.
SELECT p.name AS product_name, u.email, r.user_name, r.rating, r.comment, r.created_at
FROM reviews AS r
JOIN products AS p ON p.id = r.product_id
JOIN users AS u ON u.id = r.user_id
ORDER BY r.created_at DESC;
```

If a table's count is `0`, that feature has no saved records yet. For example, an empty `cart_items` table means no cart item has been saved; add an item while signed in, then run the cart query again.

---

### Step 2: Configure & Run the Java Backend

1. In PowerShell, navigate to the `backend/` directory and provide the local MySQL credentials for this terminal session. The password prompt is hidden, and the password is not stored in the project:
   ```powershell
   Set-Location .\backend
   $env:DB_USERNAME = "root"
   $securePassword = Read-Host "V12345" -AsSecureString
   $env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", $securePassword).Password
   ```

2. Run the Spring Boot backend:
   ```powershell
   mvn spring-boot:run
   ```
   The REST API will start at: **`http://localhost:8080`**

3. When finished, press `Ctrl+C` to stop the backend and clear the password from that terminal:
   ```powershell
   Remove-Item Env:DB_PASSWORD
   $securePassword.Dispose()
   ```

The datasource username and password are read from `DB_USERNAME` and `DB_PASSWORD`. The optional Google Gemini API key can be provided as `GEMINI_API_KEY`; if unset, the built-in hardware assistant remains available.
---

### Step 3: Run the React Frontend

1. In a new terminal window, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already built & verified):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit: **`http://localhost:5173`**

---

## 🎨 How to Customize the Logo

Open `frontend/src/components/LogoPlaceholder.jsx`:
```jsx
{/* --- CUSTOM LOGO SLOT START --- */}
<div className="w-8 h-8 rounded-lg border-2 border-dashed border-blue-500/70 bg-blue-50 flex items-center justify-center text-blue-600">
  <span className="font-mono text-xs font-bold uppercase">K</span>
</div>
{/* To change the logo, replace the div above with: */}
{/* <img src="/src/assets/images/my-logo.png" alt="Kernel Logo" className="h-8 w-auto" /> */}
{/* --- CUSTOM LOGO SLOT END --- */}
```

---

## 👤 User Roles & Instant Testing

You can instantly switch between user roles directly from the top black banner in the Navbar:
- **Regular User (Vaibhav Singh)**: Can browse, check out, track orders, build custom PCs, and sell hardware.
- **Agent (Apex Tech Wholesale)**: Access to the B2B Wholesale Portal and bulk payout analytics.
- **Admin (Kernel Administrator)**: Full access to the Admin Management Console, sales metrics, and warehouse inventory stock alerts.
