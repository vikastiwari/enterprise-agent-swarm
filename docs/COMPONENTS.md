# Enterprise Agent Swarm: Component Specifications

This document outlines the specific classes and modules that make up the multi-agent microservice architecture.

## 1. Swarm Orchestrator Module (`swarm-orchestrator`)

### `ChatController.java`
- **Role:** The primary entry point for the REST API.
- **Endpoint:** `POST /api/chat`
- **Responsibilities:** Parses incoming JSON payloads (`customerId`, `message`) and delegates the orchestration to the `SupervisorAgent`. Returns a unified JSON response.

### `SupervisorAgent.java`
- **Role:** The Chief AI Officer.
- **Responsibilities:** 
  - Initializes a customized `ChatClient` with a strict `System Prompt` that commands it to route tasks.
  - Examines user input for routing keywords.
  - Dispatches parallel execution to the `SupportAgent` using `CompletableFuture.supplyAsync()`.
  - Injects a dynamic `List<ToolCallback>` and dispatches execution to the Billing system via the Spring AI MCP Client over STDIO.
  - Aggregates the `String` outputs from both asynchronous tasks into a single, comprehensive response to the user.

### `SupportAgent.java`
- **Role:** Tier 2 Technical Support Agent.
- **Responsibilities:**
  - Implements Retrieval-Augmented Generation (RAG) using Spring AI's `SimpleVectorStore`.
  - Serves deterministic IT manual excerpts safely isolated from financial data.

### `HTNDagParser.java`
- **Role:** Deterministic Intent Router.
- **Responsibilities:** Parses LLM string outputs into structured Directed Acyclic Graphs (DAG) to guarantee reliable routing across parallel threads, providing resilience against `429 Quota Exceeded` errors via mock graph fallbacks.

### `DebateResolver.java`
- **Role:** Mathematical Validator.
- **Responsibilities:** Employs a Beta-Binomial Mixture Model to evaluate competing mathematical claims from sub-agents, mathematically determining the safest response before returning it to the user.

### `CausalArmorInterceptor.java`
- **Role:** Security Shield.
- **Responsibilities:** A standalone AOP-like interceptor that scans all incoming user prompts to prevent Indirect Prompt Injections (IPI) and jailbreak attempts.

## 2. Billing MCP Server Module (`billing-mcp-server`)

### `BillingTools.java`
- **Role:** The secure bridge between the LLM and the relational database, acting as an MCP Tool.
- **Responsibilities:** 
  - Exposes the `getCustomerBillingInfo` Java Function.
  - Communicates exclusively over the Model Context Protocol (STDIO transport), sandboxing the logic from the Orchestrator.
  
### `BillingRepository.java` & `BillingRecord.java`
- **Role:** Data Persistence.
- **Responsibilities:** 
  - Standard Spring Data JPA Repository.
  - Represents the `billing_record` table in the isolated H2 Database.

### `application.yml` (Billing Server)
- Configures the H2 in-memory database connections.
- Enables the H2 Web Console (`/h2-console`).

### `data.sql`
- Automatically executed by Spring Boot on startup within the Billing MCP Server.
- Seeds the in-memory H2 database with mock customer billing data (e.g., `CUST-1001` and `CUST-1002`) so the Billing Tool has real records to fetch.
