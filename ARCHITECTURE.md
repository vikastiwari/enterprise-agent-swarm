# Enterprise Agent Swarm: Architectural Design Document

## 1. Executive Summary
The **Enterprise Agent Swarm** is a robust, concurrent, multi-agent microservice architecture built on Java 21 and Spring Boot 3. It orchestrates complex Generative AI workflows inside a highly secure and strictly typed JVM environment. By leveraging the Orchestrator-Worker pattern, it routes user inquiries to specialized agents, restricting database access and AI hallucinations.

## 2. System Architecture
```mermaid
graph TD;
    User([End User / API Client]) -->|HTTP POST| ChatController[Chat Controller]
    
    subgraph Spring Boot Backend
        ChatController --> SupervisorAgent[Supervisor Agent (Orchestrator)]
        
        SupervisorAgent -->|Thread 1| BillingAgent[Billing Agent]
        SupervisorAgent -->|Thread 2| SupportAgent[Support Agent]
        
        BillingAgent -.->|Tool Call| DB[(H2 SQL DB)]
        SupportAgent -.->|RAG Search| Vector[(Mock Vector Store)]
    end
    
    BillingAgent --> Response[Unified Response]
    SupportAgent --> Response
    Response --> User
```

## 3. Core Architectural Decisions

### 3.1. Java 21 Virtual Threads (Project Loom)
**Problem:** Traditional AI microservices block OS threads waiting for LLM API responses (which take 2-10 seconds). This leads to thread exhaustion.
**Solution:** The Supervisor Agent uses `CompletableFuture.supplyAsync()`, which in Java 21 maps to lightweight Virtual Threads. This allows the application to handle 10,000+ concurrent LLM requests on a standard JVM without blocking OS threads.

### 3.2. Spring AI Tool Calling (Deterministic Execution)
**Problem:** LLMs cannot be trusted to perform math or securely query billing ledgers.
**Solution:** We use **Spring AI's `@Description`** annotation on Java `@Bean`s. The LLM does not execute SQL directly. Instead, it extracts the `customerId` from the prompt, hands it back to the Spring context via JSON, and the JVM executes a highly secure JPA query against the `BillingRepository`. The deterministic result is then fed back to the LLM.

### 3.3. Isolation of Concerns
- **Billing Agent:** Cannot answer technical questions; strictly bonded to the `BillingTools`.
- **Support Agent:** Cannot access financial data; strictly bonded to the technical documentation via RAG.
- **Supervisor Agent:** Only responsible for understanding intent and parallel dispatching.

## 4. Scalability & Deployment
- **Stateless Design:** The microservice is completely stateless. Session context can be managed via external Redis clusters, allowing horizontal scaling across Kubernetes pods.
- **Observability:** Easily integrates with Micrometer and Zipkin for distributed tracing, which is essential to track which sub-agent is causing high latency.
