package com.example.mcp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.concurrent.CountDownLatch;

@SpringBootApplication
public class BillingMcpApplication {

	public static void main(String[] args) throws InterruptedException {
		SpringApplication.run(BillingMcpApplication.class, args);
		new CountDownLatch(1).await();
	}

}
