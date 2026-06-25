# Communication Strategy: Enterprise Agent Swarm

This document details the internal and external communication protocols used within the multi-agent microservice architecture.

## 1. External Communication (Client-Server)
### REST API
- **Endpoint**: `POST /api/chat`
- **Protocol**: HTTP/1.1
- **Payload Structure**:
  ```json
  {
    "customerId": "CUST-1001",
    "message": "Why is my bill so high?"
  }
  ```
- **Behavior**: The client sends a synchronous HTTP request. The `ChatController` receives the request and delegates the processing to the `SupervisorAgent`. The response is returned as a plain string (or JSON in future iterations).

## 2. Internal Inter-Agent Communication (IPC)
### Java Virtual Threads & CompletableFuture
- **Strategy**: Asynchronous parallel execution using Project Loom (Java 21).
- **Logic**: The `SupervisorAgent` acts as a router. When a multi-intent query is received, it dispatches sub-tasks to the `BillingAgent` and `SupportAgent`.
- **Execution**:
  - `CompletableFuture.supplyAsync(() -> billingAgent.handle(...))`
  - `CompletableFuture.supplyAsync(() -> supportAgent.handle(...))`
- **Aggregation**: The Supervisor waits for both futures to complete using `CompletableFuture.allOf()` and aggregates the `String` outputs.

## 3. Agent to LLM Communication
### Spring AI Abstractions
- **Protocol**: HTTP REST calls to OpenAI's API (or other configured LLM providers).
- **Mechanism**: The agents use `ChatClient` (provided by Spring AI). Prompts are constructed securely on the backend, and API keys (`OPENAI_API_KEY`) are injected from the environment, ensuring the frontend never exposes keys.

## 4. Agent to Database (Tool Calling)
### OpenAI Function Calling -> JPA
- **Protocol**: In-memory JDBC connection to the H2 database (PostgreSQL in production).
- **Mechanism**: The `BillingAgent` exposes a `@Bean` marked with `@Description("Get customer billing records")`. The LLM returns a structured JSON requesting the function execution. Spring AI intercepts this, executes the local Java function (which runs a `JpaRepository` query), and feeds the result back to the LLM.
