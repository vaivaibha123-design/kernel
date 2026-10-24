package com.kernel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KernelApplication {
    public static void main(String[] args) {
        SpringApplication.run(KernelApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 KERNEL REST API is running on http://localhost:8080");
        System.out.println("=================================================");
    }
}
