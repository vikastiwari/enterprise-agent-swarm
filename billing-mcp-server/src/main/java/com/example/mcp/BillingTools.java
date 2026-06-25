package com.example.mcp;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.util.function.Function;

@Configuration
@RequiredArgsConstructor
public class BillingTools {

    private final BillingRepository billingRepository;

    public record BillingRequest(String customerId) {}
    public record BillingResponse(Double amount, String status, String notes) {}

    @Bean
    @Description("Retrieves the latest billing invoice amount and status for a given customer ID.")
    public Function<BillingRequest, BillingResponse> getCustomerBillingInfo() {
        return request -> billingRepository.findById(request.customerId())
                .map(record -> new BillingResponse(record.getLastInvoiceAmount(), record.getBillingStatus(), record.getNotes()))
                .orElse(new BillingResponse(0.0, "UNKNOWN", "Customer not found in database."));
    }
}
