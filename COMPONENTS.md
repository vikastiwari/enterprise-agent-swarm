# Enterprise Agent Swarm: Component Specifications

This document outlines the specific classes and files that make up the multi-agent microservice.

## 1. Web Layer
### `ChatController.java`
- **Role:** The primary entry point for the REST API.
- **Endpoint:** `POST /api/chat`
- **Responsibilities:** Parses incoming JSON payloads (`customerId`, `message`) and delegates the orchestration to the `SupervisorAgent`. Returns a unified JSON response.

## 2. Orchestration Layer
### `SupervisorAgent.java`
- **Role:** The Chief AI Officer.
- **Responsibilities:** 
  - Initializes a customized `ChatClient` with a strict `System Prompt` that commands it to route tasks.
  - Examines user input for routing keywords.
  - Dispatches parallel execution to the `SupportAgent` using `CompletableFuture.supplyAsync()`.
  - Dispatches parallel execution to the `Billing Agent` (LLM with Tool Calling enabled).
  - Aggregates the `String` outputs from both asynchronous tasks into a single, comprehensive response to the user.

## 3. Worker Agents Layer
### `SupportAgent.java`
- **Role:** Tier 2 Technical Support Agent.
- **Responsibilities:**
  - Designed to simulate Retrieval-Augmented Generation (RAG).
  - It intercepts technical queries (e.g., "password reset", "server issues").
  - In a production environment, it queries an external Vector Database (like PGVector or ChromaDB) to retrieve relevant IT manuals.
  - Synthesizes the manual context with the user query to produce a secure, hallucination-free technical answer.

## 4. Tool & Data Layer
### `BillingTools.java`
- **Role:** The secure bridge between the LLM and the relational database.
- **Responsibilities:** 
  - Exposes the `getCustomerBillingInfo` Java Function.
  - Maps to the OpenAI Function Calling API seamlessly using Spring AI annotations.
  
### `BillingRepository.java` & `BillingRecord.java`
- **Role:** Data Persistence.
- **Responsibilities:** 
  - Standard Spring Data JPA Repository.
  - Represents the `billing_record` table in the H2 Database.

## 5. Configuration & Initialization
### `application.yml`
- Configures the H2 in-memory database connections.
- Enables the H2 Web Console (`/h2-console`).
- Binds the OpenAI API Key from environment variables.

### `data.sql`
- Automatically executed by Spring Boot on startup.
- Seeds the in-memory H2 database with mock customer billing data (e.g., `CUST-1001` and `CUST-1002`) so the Billing Agent has real records to fetch.
