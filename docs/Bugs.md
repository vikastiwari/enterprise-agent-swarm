# Enterprise Agent Swarm: Bug Tracking & Fixes

This document tracks all bugs encountered during the end-to-end testing phase and their corresponding resolutions.

## 1. Maven Execution Context Error
- **Issue:** User ran `mvn test` in the `/home/vikas/Projects` directory, resulting in `MissingProjectException` (No POM in directory).
- **Fix:** Switched context to the correct directory: `/home/vikas/Projects/enterprise-agent-swarm`.

## 2. Spring Boot 3.4 Testing Annotation Deprecation
- **Issue:** `mvn test` failed with `cannot find symbol class MockBean`. Spring Boot 3.4.x completely removed `@MockBean` from the `org.springframework.boot.test.mock.mockito` package.
- **Fix:** Refactored `SupervisorAgentTest.java` to use the new standard `@MockitoBean` from `org.springframework.test.context.bean.override.mockito.MockitoBean`.

## 3. WSL Docker Integration Offline (Phase 2)
- **Description:** During Neo4j integration via `docker-compose`, the daemon returned `The command 'docker' could not be found in this WSL 2 distro`.
- **Root Cause:** Docker Desktop WSL 2 integration is either not enabled for the default Ubuntu distro, or Docker Desktop is not running.
- **Resolution:** Pivoted to Spring AI's zero-dependency `SimpleVectorStore` to maintain True RAG capabilities without blocking development. Neo4j integration is staged for when Docker is enabled.

## 4. RestClientAutoConfiguration ClassNotFoundException
- **Issue:** The application context failed to load because it was trying to initialize `RestClientAutoConfiguration`, but it was missing from the classpath. This was caused by an experimental/unreleased Spring Boot parent version (`4.1.0`) injected by `start.spring.io` default curl.
- **Fix:** Explicitly downgraded `<version>4.1.0</version>` to `<version>3.4.0</version>` inside `pom.xml`, and added `spring-boot-starter-web` and `spring-boot-starter-test` for comprehensive REST testing.

## 5. Spring Cloud Function Context Configuration Error
- **Issue:** `Component scan for configuration class ContextFunctionCatalogAutoConfiguration could not be used with conditions in REGISTER_BEAN phase`. This occurred because Spring Boot 3.4.0's condition evaluation engine has breaking changes incompatible with `spring-cloud-function-context` (which is pulled in by `spring-ai-openai-spring-boot-starter` for tool calling).
- **Fix:** Downgraded the Spring Boot parent version from `3.4.0` to `3.3.5`, a stable release that is fully compatible with Spring AI 1.0.0-M1.

## 5. Table "BILLING_RECORD" not found (JdbcSQLSyntaxErrorException)
- **Issue:** `data.sql` was executing before Hibernate created the database schema from the `@Entity` classes, resulting in a table not found error when attempting to insert records.
- **Fix:** Added `spring.jpa.defer-datasource-initialization: true` to `application.yml` so that database seeding happens after schema generation.

## 6. NullPointerException in ChatClient.Builder during Test Context Load
- **Issue:** Using `@MockBean` on `ChatClient.Builder` causes it to return `null` on builder methods (like `.defaultSystem()`), throwing an NPE when `SupervisorAgent` is instantiated by Spring during application context loading.
- **Fix:** Removed `@MockBean` for `ChatClient` and `ChatClient.Builder`. Instead, we mocked the underlying `ChatModel` (`@MockBean ChatModel chatModel`), which allows Spring to create the real `ChatClient` safely while still preventing actual API calls.

## 7. Unique index or primary key violation on BILLING_RECORD during tests
- **Issue:** Since multiple test classes loaded the Spring Application Context, `data.sql` was executing multiple times against the same H2 database. Because `hibernate.ddl-auto` was set to `update`, the old data remained, causing a primary key violation upon the second context load.
- **Fix:** Changed `hibernate.ddl-auto` from `create` to `create-drop` in `application.yml` so that tables are dropped and recreated correctly for each fresh Spring Context.

## 8. Spring AI Milestone Incompatibility (MCP Client NoClassDefFoundError) [RESOLVED]
- **Issue:** While refactoring to a multi-module architecture, we extracted `billing-mcp-server` and attempted to add `spring-ai-mcp-client` to `swarm-orchestrator`. However, `spring-ai-mcp-client` requires `1.0.0-M6`, which pulled in M6 core classes. The orchestrator's OpenAI client was still on `1.0.0-M1`, leading to a `NoClassDefFoundError: org/springframework/ai/tool/ToolCallbackProvider` because of massive interface changes between M1 and M6.
- **Fix:** We migrated both `swarm-orchestrator` and `billing-mcp-server` to Spring AI `1.1.8`, which fully stabilized the core API. The `ToolCallbackProvider` was replaced by native `spring-ai-mcp-client-webflux-spring-boot-starter` auto-configuration via `application.yml` `stdio` properties. We configured `SupervisorAgent` to inject a `billingChatClient` that calls `.defaultTools("getCustomerBillingInfo")`, creating a robust zero-boilerplate MCP integration.

## 9. Phase 4 - Autonomous Security Implementation (CausalArmor & Beta-Binomial)
- **Status:** **Zero Bugs!** 🟢
- **Details:** Phase 4 mathematical resolution logic and security interception were successfully introduced alongside the Phase 3 HTN parsing. The entire pipeline remains mathematically deterministic and is validated by 100% green tests!

## 10. Multi-Module Maven Wrapper Path Issue
- **Issue:** Attempting to run `./mvnw spring-boot:run` inside the `swarm-orchestrator` subdirectory throws `-bash: ./mvnw: No such file or directory`.
- **Root Cause:** The Maven Wrapper (`mvnw` and `mvnw.cmd`) is generated at the root of the multi-module project (`enterprise-agent-swarm`), not inside the child module folders.
- **Fix:** When running commands from inside a submodule directory, the correct path is `../mvnw` (e.g., `../mvnw spring-boot:run`). Alternatively, run commands from the project root using the `-pl` (project list) flag: `./mvnw -pl swarm-orchestrator spring-boot:run`.

## 11. Missing OPENAI_API_KEY causes HttpRetryException during Application Startup
- **Issue:** The console throws a massive stack trace (`java.net.HttpRetryException: cannot retry due to server authentication`) during the `ManualIngestionService` initialization when `spring-boot:run` is executed.
- **Root Cause:** Spring AI's `OpenAiEmbeddingModel` attempts to convert the Support Manuals into vector embeddings immediately when the application starts. If the `OPENAI_API_KEY` environment variable is not set (or is invalid), the OpenAI API rejects the request with an authentication error, crashing the ingestion process.
- **Fix:** Export the API key in your terminal before running the application: `export OPENAI_API_KEY=sk-...` OR add it directly into `application.yml` under `spring.ai.openai.api-key`.

## 12. Missing .env keys during spring-boot:run
- **Issue:** The application prints `GEMINI_API_KEY is missing` and falls back to OpenAI despite the keys being set in the `.env` file.
- **Root Cause:** When running `./mvnw spring-boot:run -pl swarm-orchestrator`, the working directory for the application JVM is set to `swarm-orchestrator/`, but the `.env` file was created at the root of the multi-module project.
- **Fix:** Added `spring-dotenv` to `swarm-orchestrator/pom.xml` to enable automatic `.env` parsing, and created a symbolic link in the `swarm-orchestrator/` directory pointing to the root `.env` (`ln -s ../.env .env`).

## 13. MismatchedInputException in StdioClientTransport (MCP Server)
- **Issue:** The orchestrator's MCP client throws `MismatchedInputException: No content to map due to end-of-input` upon connecting to the `billing-mcp-server`.
- **Root Cause:** The `billing-mcp-server` was writing Spring Boot startup logs (e.g., banner, Hibernate logs) directly to standard output (`System.out`). The MCP `stdio` transport strictly requires that `stdout` is reserved exclusively for JSON-RPC messages, meaning all logs must go to `stderr`.
- **Fix:** Added a `logback-spring.xml` file to `billing-mcp-server/src/main/resources` that explicitly redirects the `ConsoleAppender` target to `System.err`.

## 14. NoSuchBeanDefinitionException for EmbeddingModel (Gemini Fallback)
- **Issue:** The test context failed to load throwing `NoSuchBeanDefinitionException: No qualifying bean of type 'org.springframework.ai.embedding.EmbeddingModel' available`.
- **Root Cause:** In `ChatModelConfig.java`, we returned `geminiEmbeddingProvider.getIfAvailable()` when the Gemini API key was present. However, `spring-ai-starter-model-google-genai` does not auto-configure an `EmbeddingModel` the same way OpenAI does, so the `@Bean` returned `null`, leaving the context without a primary embedding model.
- **Fix:** Refactored `ChatModelConfig.java` to inject `List<EmbeddingModel>` instead of `ObjectProvider`s. The configuration now searches the list for a Google/Vertex model dynamically, and gracefully falls back to the OpenAI model for embeddings if a Google embedding model is missing, allowing context initialization to succeed seamlessly.
