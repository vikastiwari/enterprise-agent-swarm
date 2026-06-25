# Product Roadmap: Enterprise Agent Swarm

## Completed Phases
- [x] **Phase 1: Foundation & Bootstrapping**
  - Setup Spring Boot 3.3.5 with Java 21 Virtual Threads.
  - Integrate Spring AI 1.0.0-M1 and configure OpenAI API access.
- [x] **Phase 2: Supervisor & Concurrency**
  - Implement `SupervisorAgent` utilizing `CompletableFuture` for non-blocking concurrent execution.
  - Setup REST API Controller for client integration.
- [x] **Phase 3: Secure Tool Calling & Database**
  - Implement the `BillingAgent` with Function Calling (`@Description` on `@Bean`).
  - Configure H2 In-Memory Database and Spring Data JPA.
  - Seed initial dataset (`data.sql`) with test customer billing records.
- [x] **Phase 4: Multi-Agent Specialization**
  - Implement the `SupportAgent` to handle technical fallback queries alongside the `BillingAgent`.
  - Finalize the aggregator logic within the Supervisor.
- [x] **Phase 5: Automated Testing & Validation**
  - Setup Spring Boot Test context (`@SpringBootTest`).
  - Configure Mockito (`@MockitoBean`) to mock the `ChatModel` to prevent live LLM calls during CI/CD.

## Upcoming Phases
- [ ] **Phase 6: True RAG Implementation**
  - Integrate `spring-ai-pgvector` or ChromaDB to replace mock static text in the `SupportAgent`.
  - Ingest PDF IT manuals and perform chunking and embedding generation.
- [ ] **Phase 7: Frontend Dashboard**
  - Develop a React/Next.js "Admin Chat Interface".
  - Stream responses using Server-Sent Events (SSE) or WebSockets.
- [ ] **Phase 8: Production Deployment**
  - Migrate from H2 to PostgreSQL.
  - Dockerize the application and deploy to a Kubernetes cluster.
  - Implement OpenTelemetry for distributed tracing of agent calls.
