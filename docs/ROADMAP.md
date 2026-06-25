# Product Roadmap: Enterprise Agent Swarm

## Completed Phases
- [x] **Phase 1: Foundation & Bootstrapping**
  - Setup Spring Boot 3.3.5 with Java 21 Virtual Threads.
  - Integrate Spring AI and configure OpenAI API access.
  - Refactored into a **Multi-Module Maven architecture**.
- [x] **Phase 2: Supervisor & Concurrency**
  - Implement `SupervisorAgent` utilizing `CompletableFuture` for non-blocking concurrent execution.
  - Setup REST API Controller for client integration.
- [x] **Phase 3: Secure Tool Calling & Database (MCP Server)**
  - Extracted the `BillingAgent` into an isolated `billing-mcp-server`.
  - Configured Model Context Protocol (MCP) server integration (`spring-ai-mcp-server-webmvc`).
  - Configure H2 In-Memory Database and Spring Data JPA.
  - Seed initial dataset (`data.sql`) with test customer billing records.
- [x] **Phase 4: Multi-Agent Specialization**
  - Implement the `SupportAgent` to handle technical fallback queries alongside the `BillingAgent`.
  - Finalize the aggregator logic within the Supervisor.
- [x] **Phase 5: Automated Testing & Validation**
  - Setup Spring Boot Test context (`@SpringBootTest`).
  - Configure Mockito (`@MockitoBean`) to mock the `ChatModel` to prevent live LLM calls during CI/CD.

## Upcoming Phases
- [ ] **### Phase 2: Next-Generation RAG & Knowledge Synthesis ✅
- **Status:** Completed
- **Details:** Pivoted to `SimpleVectorStore` for rapid prototyping (due to Docker WSL restrictions). Implemented `ManualIngestionService` and integrated `QuestionAnswerAdvisor` into `SupportAgent`.

### Phase 3: Deterministic Orchestration 🗓️
- **Status:** Completed
- **Details:** Implemented Hierarchical Task Networks (HTN) DAG parsing in `SupervisorAgent` and established an immutable Deterministic Projection Memory (DPM) Event Log using H2 in PostgreSQL compatibility mode.

- [ ] **Phase 7: Frontend Dashboard**
  - Develop a React/Next.js "Admin Chat Interface".
- [ ] **Phase 8: Production Deployment**
  - Migrate from H2 to PostgreSQL.
  - Dockerize the application and deploy to a Kubernetes cluster.
  - Implement OpenTelemetry for distributed tracing of agent calls.
