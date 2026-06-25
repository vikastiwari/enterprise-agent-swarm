package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillingRecord {
    @Id
    private String customerId;
    private Double lastInvoiceAmount;
    private String billingStatus; // PAID, OVERDUE, PENDING
    private String notes;
}
