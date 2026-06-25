#!/bin/bash
echo "[Test 1: Billing]"
curl -s -X POST http://localhost:8080/api/chat \
-H "Content-Type: application/json" \
-d '{"customerId": "CUST-1001", "message": "What is my current balance?"}'
echo ""

echo "[Test 2: Support/RAG]"
curl -s -X POST http://localhost:8080/api/chat \
-H "Content-Type: application/json" \
-d '{"customerId": "CUST-1001", "message": "Can I get a refund if I cancel my subscription early?"}'
echo ""

echo "[Test 3: Both]"
curl -s -X POST http://localhost:8080/api/chat \
-H "Content-Type: application/json" \
-d '{"customerId": "CUST-1001", "message": "What is my balance, and what is your refund policy?"}'
echo ""
