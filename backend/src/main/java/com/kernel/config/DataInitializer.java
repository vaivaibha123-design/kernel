package com.kernel.config;

import com.kernel.model.*;
import com.kernel.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final OrderRepository orderRepository;

    public DataInitializer(ProductRepository productRepository, 
                           UserRepository userRepository, 
                           PriceHistoryRepository priceHistoryRepository, 
                           OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.priceHistoryRepository = priceHistoryRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }

        if (productRepository.count() == 0) {
            seedProductsAndPrices();
        }

        if (orderRepository.count() == 0) {
            seedOrders();
        }
    }

    private void seedUsers() {
        User user1 = new User("Vaibhav Singh", "vaibhav@email.com", "+91 98765 43210", "password123", "USER",
                "Thakur College Road, Kandivali (E)", "Mumbai", "Maharashtra", "400101");
        User agent = new User("Apex Tech Wholesale", "agent@kernel.in", "+91 98220 12345", "agent123", "AGENT",
                "Lamington Road, Grant Road", "Mumbai", "Maharashtra", "400007");
        User admin = new User("Kernel System Administrator", "admin@kernel.in", "+91 99999 88888", "admin123", "ADMIN",
                "Kernel Tech Tower, Bandra Kurla Complex", "Mumbai", "Maharashtra", "400051");

        userRepository.save(user1);
        userRepository.save(agent);
        userRepository.save(admin);
    }

    private void seedProductsAndPrices() {
        Product p1 = new Product(
                "NVIDIA GeForce RTX 4070 Super 12GB GDDR6X",
                "nvidia-geforce-rtx-4070-super-12gb",
                "Graphics Cards",
                "NVIDIA",
                "New",
                BigDecimal.valueOf(49999.00),
                BigDecimal.valueOf(58999.00),
                15,
                24,
                "/src/assets/images/products/rtx-4070-super.svg",
                "The RTX 4070 Super delivers excellent 1440p and 4K gaming performance with DLSS 3 and ray tracing. Perfect for gamers and creators.",
                "{\"memory\": \"12GB GDDR6X\", \"cuda_cores\": 7168, \"boost_clock\": \"2475 MHz\", \"ports\": \"3x DisplayPort 1.4a, 1x HDMI 2.1a\", \"tdp\": \"220W\", \"interface\": \"PCIe 4.0 x16\"}",
                true,
                true
        );
        p1.setRating(4.8);
        p1.setReviewCount(120);
        productRepository.save(p1);

        // Price trends for RTX 4070 Super
        priceHistoryRepository.save(new PriceHistory(p1.getId(), BigDecimal.valueOf(54999.00), LocalDate.now().minusMonths(5), "Market Average"));
        priceHistoryRepository.save(new PriceHistory(p1.getId(), BigDecimal.valueOf(53499.00), LocalDate.now().minusMonths(4), "Market Average"));
        priceHistoryRepository.save(new PriceHistory(p1.getId(), BigDecimal.valueOf(52999.00), LocalDate.now().minusMonths(3), "Promo Sale"));
        priceHistoryRepository.save(new PriceHistory(p1.getId(), BigDecimal.valueOf(51999.00), LocalDate.now().minusMonths(2), "Market Average"));
        priceHistoryRepository.save(new PriceHistory(p1.getId(), BigDecimal.valueOf(50999.00), LocalDate.now().minusMonths(1), "Festive Drop"));
        priceHistoryRepository.save(new PriceHistory(p1.getId(), BigDecimal.valueOf(49999.00), LocalDate.now(), "Current Kernel Deal"));

        Product p2 = new Product(
                "AMD Ryzen 7 7800X3D Processor",
                "amd-ryzen-7-7800x3d",
                "CPUs",
                "AMD",
                "New",
                BigDecimal.valueOf(32999.00),
                BigDecimal.valueOf(39999.00),
                18,
                18,
                "/src/assets/images/products/ryzen-7-7800x3d.svg",
                "The undisputed king of PC gaming processors with 96MB of 3D V-Cache.",
                "{\"cores\": 8, \"threads\": 16, \"base_clock\": \"4.2 GHz\", \"boost_clock\": \"5.0 GHz\", \"l3_cache\": \"96MB 3D V-Cache\", \"socket\": \"AM5\", \"tdp\": \"120W\"}",
                true,
                true
        );
        p2.setRating(4.9);
        p2.setReviewCount(235);
        productRepository.save(p2);

        Product p3 = new Product(
                "Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz CL30",
                "corsair-vengeance-32gb-ddr5-6000",
                "RAM",
                "Corsair",
                "New",
                BigDecimal.valueOf(8499.00),
                BigDecimal.valueOf(10999.00),
                23,
                45,
                "/src/assets/images/products/corsair-ddr5-32gb.svg",
                "Ultra-low latency AMD EXPO and Intel XMP 3.0 certified high-frequency gaming memory.",
                "{\"capacity\": \"32GB (2 x 16GB)\", \"speed\": \"DDR5 6000MT/s\", \"timing\": \"CL30-36-36-76\", \"voltage\": \"1.35V\", \"form_factor\": \"288-pin DIMM\"}",
                true,
                true
        );
        p3.setRating(4.9);
        p3.setReviewCount(88);
        productRepository.save(p3);

        priceHistoryRepository.save(new PriceHistory(p3.getId(), BigDecimal.valueOf(11499.00), LocalDate.now().minusMonths(5), "Market Average"));
        priceHistoryRepository.save(new PriceHistory(p3.getId(), BigDecimal.valueOf(10899.00), LocalDate.now().minusMonths(4), "Market Average"));
        priceHistoryRepository.save(new PriceHistory(p3.getId(), BigDecimal.valueOf(9999.00), LocalDate.now().minusMonths(3), "DDR5 Price Drop"));
        priceHistoryRepository.save(new PriceHistory(p3.getId(), BigDecimal.valueOf(9299.00), LocalDate.now().minusMonths(2), "Market Average"));
        priceHistoryRepository.save(new PriceHistory(p3.getId(), BigDecimal.valueOf(8799.00), LocalDate.now().minusMonths(1), "Wholesale Discount"));
        priceHistoryRepository.save(new PriceHistory(p3.getId(), BigDecimal.valueOf(8499.00), LocalDate.now(), "Current Kernel Deal"));

        Product p4 = new Product(
                "Samsung 980 Pro 1TB PCIe Gen4 NVMe M.2 SSD",
                "samsung-980-pro-1tb-nvme",
                "Storage",
                "Samsung",
                "New",
                BigDecimal.valueOf(7499.00),
                BigDecimal.valueOf(9499.00),
                21,
                32,
                "/src/assets/images/products/samsung-980-pro-1tb.svg",
                "Blazing fast speeds up to 7,000 MB/s read and 5,000 MB/s write.",
                "{\"capacity\": \"1TB\", \"interface\": \"PCIe Gen 4.0 x4, NVMe 1.3c\", \"read_speed\": \"7,000 MB/s\", \"write_speed\": \"5,000 MB/s\"}",
                true,
                false
        );
        p4.setRating(4.8);
        p4.setReviewCount(142);
        productRepository.save(p4);

        Product p5 = new Product(
                "MSI B650 Gaming Plus WiFi Motherboard",
                "msi-b650-gaming-plus-wifi",
                "Motherboards",
                "MSI",
                "New",
                BigDecimal.valueOf(16999.00),
                BigDecimal.valueOf(19999.00),
                15,
                15,
                "/src/assets/images/products/msi-b650-gaming-plus.svg",
                "Feature-packed AM5 ATX motherboard with Wi-Fi 6E, 2.5G LAN, and Lightning Gen 4 M.2.",
                "{\"socket\": \"AM5\", \"chipset\": \"AMD B650\", \"form_factor\": \"ATX\", \"memory\": \"4x DDR5 up to 192GB\"}",
                true,
                false
        );
        p5.setRating(4.7);
        p5.setReviewCount(64);
        productRepository.save(p5);

        Product p6 = new Product(
                "AMD Radeon RX 6700 XT 12GB",
                "amd-radeon-rx-6700-xt-12gb-used",
                "Graphics Cards",
                "AMD",
                "Used",
                BigDecimal.valueOf(24999.00),
                BigDecimal.valueOf(34999.00),
                29,
                8,
                "/src/assets/images/products/rx-6700-xt.svg",
                "Certified pre-owned graphics card, stress-tested with Furmark and 3DMark.",
                "{\"memory\": \"12GB GDDR6\", \"stream_processors\": 2560, \"game_clock\": \"2424 MHz\"}",
                false,
                true
        );
        p6.setRating(4.6);
        p6.setReviewCount(43);
        productRepository.save(p6);

        Product p7 = new Product(
                "NVIDIA GeForce RTX 3060 12GB",
                "nvidia-rtx-3060-12gb-refurbished",
                "Graphics Cards",
                "NVIDIA",
                "Refurbished",
                BigDecimal.valueOf(29999.00),
                BigDecimal.valueOf(36999.00),
                19,
                12,
                "/src/assets/images/products/rtx-3060.svg",
                "Factory renewed by authorized technicians. Repasted with Arctic MX-6.",
                "{\"memory\": \"12GB GDDR6\", \"cuda_cores\": 3584, \"boost_clock\": \"1777 MHz\"}",
                false,
                true
        );
        p7.setRating(4.5);
        p7.setReviewCount(57);
        productRepository.save(p7);

        Product p8 = new Product(
                "MSI RTX 4060 Ventus 2X Black 8G OC",
                "msi-rtx-4060-ventus-2x-8g",
                "Graphics Cards",
                "MSI",
                "New",
                BigDecimal.valueOf(36999.00),
                BigDecimal.valueOf(41999.00),
                12,
                14,
                "/src/assets/images/products/msi-rtx-4060.svg",
                "Compact dual fan design with TORX Fan 4.0 and Ada Lovelace efficiency.",
                "{\"memory\": \"8GB GDDR6\", \"cuda_cores\": 3072, \"boost_clock\": \"2490 MHz\"}",
                false,
                false
        );
        p8.setRating(4.7);
        p8.setReviewCount(39);
        productRepository.save(p8);

        Product p9 = new Product(
                "ZOTAC GAMING GeForce RTX 3080 Trinity 10GB",
                "zotac-rtx-3080-10gb-used",
                "Graphics Cards",
                "ZOTAC",
                "Used",
                BigDecimal.valueOf(56999.00),
                BigDecimal.valueOf(74999.00),
                24,
                5,
                "/src/assets/images/products/zotac-rtx-3080.svg",
                "Pre-owned 4K powerhouse with IceStorm 2.0 advanced cooling and Metal Frontplate.",
                "{\"memory\": \"10GB GDDR6X\", \"cuda_cores\": 8704, \"boost_clock\": \"1710 MHz\"}",
                false,
                false
        );
        p9.setRating(4.7);
        p9.setReviewCount(29);
        productRepository.save(p9);

        Product p10 = new Product(
                "ASUS Dual Radeon RX 6600 XT OC Edition 8GB",
                "asus-rx-6600-xt-8gb-refurbished",
                "Graphics Cards",
                "ASUS",
                "Refurbished",
                BigDecimal.valueOf(27999.00),
                BigDecimal.valueOf(33999.00),
                18,
                9,
                "/src/assets/images/products/asus-rx-6600-xt.svg",
                "Axial-tech fan design with dual ball bearings for high reliability.",
                "{\"memory\": \"8GB GDDR6\", \"stream_processors\": 2048, \"boost_clock\": \"2607 MHz\"}",
                false,
                false
        );
        p10.setRating(4.6);
        p10.setReviewCount(19);
        productRepository.save(p10);

        Product p11 = new Product(
                "Cooler Master MasterBox MB520 ARGB Cabinet",
                "cooler-master-masterbox-mb520-argb",
                "Cabinets",
                "Cooler Master",
                "New",
                BigDecimal.valueOf(6499.00),
                BigDecimal.valueOf(7999.00),
                19,
                20,
                "/src/assets/images/products/cooler-master-mb520.svg",
                "High airflow front mesh design with three pre-installed 120mm CF120 ARGB fans.",
                "{\"form_factor\": \"Mid Tower\", \"motherboard_support\": \"ATX, Micro ATX, Mini ITX\"}",
                false,
                false
        );
        p11.setRating(4.7);
        p11.setReviewCount(52);
        productRepository.save(p11);

        Product p12 = new Product(
                "Corsair RM750e 750W 80 PLUS Gold Fully Modular ATX 3.0 PSU",
                "corsair-rm750e-750w-gold-modular",
                "Power Supplies",
                "Corsair",
                "New",
                BigDecimal.valueOf(7999.00),
                BigDecimal.valueOf(9499.00),
                16,
                25,
                "/src/assets/images/products/corsair-rm750e.svg",
                "Quiet, reliable 80 PLUS Gold efficient power delivery with PCIe Gen 5 12VHPWR native cable support.",
                "{\"wattage\": \"750W\", \"efficiency\": \"80 PLUS Gold\", \"modular\": \"Fully Modular\"}",
                false,
                false
        );
        p12.setRating(4.9);
        p12.setReviewCount(76);
        productRepository.save(p12);

        Product p13 = new Product(
                "Kernel Apex Beast - Custom RTX 4080 Super Pre-built Rig",
                "kernel-apex-beast-rtx-4080-super",
                "PC Builds",
                "Kernel",
                "New",
                BigDecimal.valueOf(189999.00),
                BigDecimal.valueOf(219999.00),
                14,
                4,
                "/src/assets/images/products/pc-build-apex.svg",
                "Turnkey monster workstation and gaming rig: Ryzen 9 7950X3D, RTX 4080 Super 16GB, 64GB DDR5, 2TB Gen4 SSD.",
                "{\"cpu\": \"Ryzen 9 7950X3D\", \"gpu\": \"RTX 4080 Super 16GB\", \"ram\": \"64GB DDR5 6000MHz\"}",
                true,
                true
        );
        p13.setRating(5.0);
        p13.setReviewCount(15);
        productRepository.save(p13);
    }

    private void seedOrders() {
        User seededUser = userRepository.findByEmail("vaibhav@email.com").orElse(null);
        if (seededUser == null) return;
        Long seededUserId = seededUser.getId();

        Order o1 = new Order();
        o1.setOrderNumber("HR123456");
        o1.setUserId(seededUserId);
        o1.setTotalAmount(BigDecimal.valueOf(75497.00));
        o1.setStatus("SHIPPED");
        o1.setPaymentMethod("UPI");
        o1.setShippingName("Vaibhav Singh");
        o1.setShippingPhone("+91 98765 43210");
        o1.setShippingAddress("Thakur College Road, Kandivali (E)");
        o1.setShippingCity("Mumbai");
        o1.setShippingPostalCode("400101");
        o1.setEstimatedDelivery(LocalDate.now().plusDays(3));
        orderRepository.save(o1);

        Order o2 = new Order();
        o2.setOrderNumber("HR123455");
        o2.setUserId(seededUserId);
        o2.setTotalAmount(BigDecimal.valueOf(32999.00));
        o2.setStatus("DELIVERED");
        o2.setPaymentMethod("CARD");
        o2.setShippingName("Vaibhav Singh");
        o2.setShippingPhone("+91 98765 43210");
        o2.setShippingAddress("Thakur College Road, Kandivali (E)");
        o2.setShippingCity("Mumbai");
        o2.setShippingPostalCode("400101");
        orderRepository.save(o2);

        Order o3 = new Order();
        o3.setOrderNumber("HR123454");
        o3.setUserId(seededUserId);
        o3.setTotalAmount(BigDecimal.valueOf(18499.00));
        o3.setStatus("PROCESSING");
        o3.setPaymentMethod("UPI");
        o3.setShippingName("Vaibhav Singh");
        o3.setShippingPhone("+91 98765 43210");
        o3.setShippingAddress("Thakur College Road, Kandivali (E)");
        o3.setShippingCity("Mumbai");
        o3.setShippingPostalCode("400101");
        orderRepository.save(o3);

        Order o4 = new Order();
        o4.setOrderNumber("HR123453");
        o4.setUserId(seededUserId);
        o4.setTotalAmount(BigDecimal.valueOf(56978.00));
        o4.setStatus("DELIVERED");
        o4.setPaymentMethod("NET_BANKING");
        o4.setShippingName("Vaibhav Singh");
        o4.setShippingPhone("+91 98765 43210");
        o4.setShippingAddress("Thakur College Road, Kandivali (E)");
        o4.setShippingCity("Mumbai");
        o4.setShippingPostalCode("400101");
        orderRepository.save(o4);
    }
}
