package com.example.demo.repository;

import com.example.demo.model.BillingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillingRepository extends JpaRepository<BillingRecord, String> {
}
