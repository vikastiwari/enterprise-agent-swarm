package com.example.mcp;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BillingTools {

    private final BillingRepository billingRepository;

    public record BillingRequest(String customerId) {}
    public record BillingResponse(Double amount, String status, String notes) {}

    @Tool(description = "Retrieves the latest billing invoice amount and status for a given customer ID.")
    public BillingResponse getCustomerBillingInfo(BillingRequest request) {
        return billingRepository.findById(request.customerId())
                .map(record -> new BillingResponse(record.getLastInvoiceAmount(), record.getBillingStatus(), record.getNotes()))
                .orElse(new BillingResponse(0.0, "UNKNOWN", "Customer not found in database."));
    }

}
