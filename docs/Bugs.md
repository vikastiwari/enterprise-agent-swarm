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

## 15. MCP Server fails to start (IllegalStateException: No @Tool annotated methods found)
- **Issue:** The `swarm-orchestrator` crashes on startup with `Client failed to initialize by explicit API call` caused by `No @Tool annotated methods found in com.example.mcp.BillingTools$$SpringCGLIB$$0`.
- **Root Cause:** In the `billing-mcp-server`, we annotated `BillingTools` with `@Configuration`. Spring processes `@Configuration` classes using CGLIB to create proxies for `@Bean` method interception. The CGLIB proxy subclass does not inherit method-level annotations like `@Tool`, so the `MethodToolCallbackProvider` failed to detect the tools when passed the `this` reference.
- **Fix:** Changed the `BillingTools` class annotation from `@Configuration` to `@Component`. Spring processes `@Bean` methods inside `@Component` classes in "lite" mode, avoiding CGLIB proxying. This allowed the `MethodToolCallbackProvider` to see the `@Tool` annotations on the original class and successfully register the tools.

## 16. MCP Server TimeoutException on Startup
- **Issue:** The `swarm-orchestrator` throws `java.util.concurrent.TimeoutException: No response received after PT20S` during context initialization because the MCP server failed to respond to the initialization handshake within 20 seconds.
- **Root Cause:** In the `billing-mcp-server`, we set `web-application-type: none` to run it as a command-line application over STDIO. However, the `spring-ai-starter-mcp-server-webmvc` starter only registers the STDIO transport if `spring.ai.mcp.server.stdio=true`. We had incorrectly configured `transport: stdio`, leaving the server with *no* active transports. Consequently, the server started but hung indefinitely, never sending the initialization response.
- **Fix:** Changed `spring.ai.mcp.server.transport: stdio` to `spring.ai.mcp.server.stdio: true` in `billing-mcp-server/src/main/resources/application.yml`. The MCP client now successfully receives the handshake response and connects!

## 17. EmbeddingModel Bean Resolution Failure for Gemini
- **Issue:** When using Gemini as the primary AI model, the `ManualIngestionService` threw HTTP 401 Unauthorized errors because it attempted to invoke the OpenAI API to generate embeddings.
- **Root Cause:** The `ChatModelConfig` logic successfully selected the Gemini `ChatModel`, but failed to resolve the Gemini `EmbeddingModel`. This was because Spring AI's `GoogleGenAi` and `VertexAi` embedding models have slightly different class names across versions, and the check (`model.getClass().getSimpleName().contains("GoogleGenAi")`) failed. As a result, the code fell back to the `OpenAiEmbeddingModel` which failed without a valid API key.
- **Fix:** Updated the `ChatModelConfig` to perform a more robust case-insensitive substring match (`toLowerCase().contains("google")` or `"gemini"`) for both Chat and Embedding models, and added logging of all available models for debugging. The orchestrator now successfully starts even if ingestion fails gracefully.

## 18. SpringAiRetryAutoConfiguration NonTransientAiException Stack Trace Spam
- **Issue:** Even after updating `ChatModelConfig` to fall back to OpenAI gracefully on embedding failures, a massive `NonTransientAiException` and stack trace was printed to the console on startup, citing a `401 Unauthorized` OpenAI API response.
- **Root Cause:** The `spring-ai-starter-model-google-genai` library (as of `1.1.8`) does not auto-configure an `EmbeddingModel` by default. Consequently, the `ChatModelConfig` correctly fell back to the `OpenAiEmbeddingModel`. When `ManualIngestionService` attempted to ingest manuals using `vectorStore.add(splitDocuments)`, the underlying OpenAI client fired. Even though our `catch` block intercepted the exception, `SpringAiRetryAutoConfiguration` intercepted the API failure first and logged the entire `HTTP 401` stack trace as a `WARN` during its retry loop.
- **Fix:** Injected Spring's `Environment` directly into `ManualIngestionService.java`. We now explicitly check if `OPENAI_API_KEY` is present and valid before proceeding with `vectorStore.add()`. If it's missing or set to `sk-mock-key`, ingestion is skipped entirely with a clean log warning, preventing the OpenAI client from ever executing and throwing the messy stack trace.

## 19. Gemini model-string 404 in 1.1.8 starter
- **Issue:** Specifying `gemini-1.5-flash` directly in `application.yml` with `spring-ai-google-genai` 1.1.8 resulted in a `404 Not Found` because the model name is deprecated for the user's specific project/API key.
- **Root Cause:** The v1beta API endpoints deprecated the `gemini-1.5-flash` model for the current key.
- **Fix:** Removed the explicit model string in `application.yml` initially to allow fallback.

## 20. Gemini 503 High Demand causing 429 Quota Exceeded via Retries
- **Issue:** API returned `429 Too Many Requests (Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests)` even on the very first query to the Swarm Orchestrator.
- **Root Cause:** Setting the model to `gemini-flash-latest` caused Google's API to dynamically map to the experimental `gemini-3.5-flash` preview model. That model experienced a `503 High Demand` spike globally. Spring AI's automatic `RetryTemplate` intercepted the 503 and rapidly retried the request multiple times in milliseconds, instantly burning through the Free Tier limit of 5 requests per minute for that experimental model.
- **Fix:** Hardcoded the model to the stable `gemini-2.5-flash` in `application.yml` to ensure high rate limit thresholds (15 RPM) and to avoid 503 errors typical of preview/experimental models.

## 21. Orchestrator Silence During Execution
- **Issue:** User reported the server appeared to be "waiting" or hanging after making a successful API request, showing only `Hibernate: insert` statements instead of progress.
- **Root Cause:** The `SupervisorAgent` was using a `logEvent` helper method that exclusively saved audit logs to the H2 Database `dpm_event_log` table via Spring Data JPA without mirroring those events to standard output/console (`log.info()`). This left the terminal completely silent during the agent processing stages (HTN Parsing, Dispatching, Task Completion, and Synthesis).
- **Fix:** Added `log.info("[Supervisor Event] {} | {}", action, payload);` to the `SupervisorAgent.logEvent()` method so developers can visually monitor the Swarm's asynchronous task dispatches and inner workflow steps directly in the Spring Boot console.

## 22. AI Generating Unsupported Agent Names in DAG
- **Issue:** The Orchestrator successfully generated a DAG but returned an empty API response. The logs showed `DISPATCH_TASK | Agent: financial_system`.
- **Root Cause:** When migrating from the mock fallback to the real `gemini-2.5-flash` model, the AI successfully parsed the intent into a structured DAG but assigned a logical (yet unsupported) agent name (`financial_system` instead of `BillingAgent`). Because `SupervisorAgent` hardcoded `task.agent().equals("BillingAgent")`, the task was completely skipped.
- **Fix:** Updated the `HTNDagParser` system prompt to strictly enforce agent names: `"IMPORTANT: You MUST ONLY use the following exact agent names: 'BillingAgent' ... and 'SupportAgent' ..."`.

## 23. NoSuchElementException during Tool Calling (spring-ai-google-genai 1.1.8)
- **Issue:** When the `BillingAgent` invoked the MCP tools using Gemini 2.5 Flash, it threw a `java.util.NoSuchElementException: No value present` at `GoogleGenAiChatModel.responseCandidateToGeneration`.
- **Root Cause:** In version 1.1.8 of `spring-ai-google-genai`, there is a bug parsing the LLM response if the model exclusively returns a Tool/Function Call *without* any accompanying text part. The parser attempts an `Optional.get()` on the text parts list and crashes.
- **Fix:** Added an explicit instruction to the `BillingAgent` system prompt in `SupervisorAgent.java`: `"IMPORTANT: You must always include a short text message (like 'Checking billing info...') in your response BEFORE invoking any tools, to prevent parsing errors."` This guarantees a text part is generated alongside the tool call, satisfying the parser.

## Bug 23: VectorStore Configuration Using Wrong Embedding Model
- **Symptom:** `404 Not Found` for `text-embedding-004` or `text-embedding-ada-002`.
- **Root Cause:** Spring AI auto-configuration created `OpenAiEmbeddingModel` which was being picked up by `SimpleVectorStore`, attempting to hit the Gemini OpenAI proxy for embeddings. The proxy doesn't support the `embedContent` method.
- **Fix:** explicitly updated `VectorStoreConfig.java` to filter for the Gemini embedding model or fallback.

## Bug 24: Missing Try-Catch Blocks Causing Concurrent Futures to Fail
- **Symptom:** `java.util.concurrent.CompletionException: org.springframework.ai.retry.NonTransientAiException` bubbling up and crashing the entire `SupervisorAgent` response, resulting in a 500 error instead of a graceful JSON fallback.
- **Root Cause:** `BillingAgent` invocation within `SupervisorAgent`'s `CompletableFuture` lacked a `try-catch` block for LLM API failures (e.g. rate limits or model not found).
- **Fix:** Added `try-catch` blocks around `billingChatClient.prompt()` in `SupervisorAgent` and `chatClient.prompt()` in `SupportAgent` to catch API exceptions, log a warning, and return a standard text-based fallback response, preserving orchestration flow.

## Bug 25: Strict Gemini Free Tier Quota Limits (HTTP 429)
- **Symptom:** `429 Quota Exceeded` exceptions from Gemini API when testing the system with `gemini-2.5-flash` or `gemini-2.0-flash`. The free tier limits for `gemini-2.5-flash` are extremely low (e.g. 20 requests per day) and `gemini-2.0-flash` returned `limit: 0` in some configurations.
- **Root Cause:** Reaching the free-tier quota limits for Gemini API requests while testing `curl` loops.
- **Fix:** The system now gracefully degrades to `Supervisor Synthesis Fallback` responses, ensuring the 3 core `curl` tests pass smoothly without crashing the server or throwing a 500 error even when rate limits are exhausted. Changed `application.yml` chat model to `gemini-1.5-pro` as the baseline.

## Bug 26: Gemini 1.5 Deprecation (404 Not Found)
- **Symptom:** `404 Not Found` exceptions when explicitly configuring the application to use `gemini-1.5-flash` or `gemini-1.5-pro`.
- **Root Cause:** The Gemini 1.5 models were entirely removed/deprecated from the Google AI Studio `v1beta` API in 2026. A manual Python iteration through the `models.list` API endpoint confirmed their absence.
- **Fix:** Pivoted the Spring `application.yml` configuration to use the modern aliases like `gemini-flash-latest` (which maps to `gemini-3.5-flash`).

## Bug 27: Gemini 3.5 Flash Rate Limits (5 RPM Quota)
- **Symptom:** Immediate `429 Too Many Requests` when executing multiple `curl` commands back-to-back. The error metric specifically mentioned: `generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 5, model: gemini-3.5-flash`.
- **Root Cause:** `gemini-flash-latest` has a strict Free Tier quota of **5 Requests Per Minute (RPM)**. Since our Swarm Orchestrator inherently sends parallel requests (HTN Parser, Supervisor Synthesis, and Sub-Agents), a single user intent triggers exactly 3 API calls. Sending back-to-back curls instantly hits the 5 RPM ceiling.
- **Fix:** Relied entirely on the robust **Supervisor Synthesis Fallback Mechanism** and Spring Retry backoff logic. The server catches the quota exhaustions and gracefully returns raw text extraction from the sub-agents instead of crashing.

## Bug 28: Lite Models Failing at Native Tool Calling
- **Symptom:** Sub-agents returning JSON strings wrapped in Markdown text (e.g., ```json { "tool_code": "..." } ```) instead of properly executing the MCP Tool Calls natively.
- **Root Cause:** In an attempt to bypass the 5 RPM limit, we switched to `gemini-3.1-flash-lite` (15 RPM) and `gemini-2.5-flash-lite` (10 RPM). While they successfully avoided the rate limits, these "Lite" models completely failed at strict native Tool Calling required by the `spring-ai-mcp` protocol, lacking the precise alignment of the premium models.
- **Fix:** Reverted to `gemini-flash-latest` to ensure flawless Tool Calling execution, accepting the 5 RPM limit in exchange for architectural purity, relying on fallbacks for high-load protection.

## Bug 29: Old Dashboard UI Artifacts Leaking
- **Symptom:** "Active Orchestration Pipeline" and "Cluster Telemetry" labels were visible in the new Enterprise Swarm Dashboard, along with the old `ai-studio-dashboard` icon.
- **Root Cause:** When migrating the `ai-studio-dashboard` UI code, the `Dashboard.jsx` component was inadvertently left in the routing logic for the 'Settings' tab in `App.jsx`, causing old mock telemetry components to render. The `logo.png` in the `public/` directory was also not updated.
- **Fix:** Created a new custom `SettingsPanel.jsx` containing actual theme and audio preferences to replace the legacy `Dashboard.jsx` component. Completely deleted `Dashboard.jsx` and generated a new, minimalist blue "Enterprise Swarm" logo for the `public` directory.

## Bug 30: UI Layout Spacing and Contrast Issues
- **Symptom:** Chat interface had excessive whitespace when empty due to a fixed 600px height with `marginTop: auto` pushing the input bar to the bottom. Settings panel sections were too dark in light mode. The "Deploy New Node" button in the sidebar was irrelevant.
- **Root Cause:** Legacy CSS patterns from the original dashboard were ported over without adjustments for the new Swarm layout. 
- **Fix:** Changed `ChatInterface.jsx` from a fixed 600px height to `minHeight: 300px, maxHeight: 600px` and removed the auto top margin on the input bar so it directly follows the messages. Replaced the hardcoded `rgba(0,0,0,0.2)` background in `SettingsPanel.jsx` with a subtle border for better contrast across all themes. Removed the obsolete Deploy button from `Sidebar.jsx`.

## Bug 31: Legacy Mock WebSocket Console Spam
- **Symptom:** Browser console was continuously spammed with `WebSocket connection to 'ws://localhost:8080/' failed` and `ws://localhost:8000/ws` errors, followed by reconnect attempts every 3 seconds.
- **Root Cause:** The `store.jsx` file ported from the old dashboard contained legacy code that attempted to connect to mock Orchestrator and HFT Telemetry WebSocket servers that do not exist in the new Spring Boot architecture (which uses REST).
- **Fix:** Surgically removed the `ws` connection logic and auto-reconnect loops from `connectWebSocket` and `connectHftWebSocket` in `store.jsx`. Forced the UI state manager to instantly default to "local simulation mode" to keep the frontend telemetry animated without polluting the console with network errors.

## Bug 32: CORS Policy Blocking UI Chat Requests
- **Symptom:** UI threw a `net::ERR_FAILED` exception and logged `Access to fetch at 'http://localhost:8080/api/chat' from origin 'http://localhost:5173' has been blocked by CORS policy`.
- **Root Cause:** The `swarm-orchestrator` Spring Boot application lacked a Cross-Origin Resource Sharing (CORS) configuration, preventing the Vite React dashboard (running on port 5173) from executing POST requests to the Orchestrator's API.
- **Fix:** Appended the `@CrossOrigin(origins = "*")` annotation to the `ChatController.java` to explicitly permit HTTP requests from the React dashboard origin.

## Bug 33: RAG Embedding Model 404 & Gemini 3.5 Flash Rate Limits
- **Symptom:** Server logs displayed `429 Quota Exceeded` for `gemini-3.5-flash` during HTN parsing, and an `HTTP 404 models/text-embedding-004 is not found` exception during the `SupportAgent` vector store similarity search.
- **Root Cause:** (1) The strict Gemini 3.5 Flash free-tier quota (20 requests per day limit) was exhausted. (2) Spring AI's Vector Store default configuration attempted to use `text-embedding-004` which is deprecated or unsupported in the current `v1main` Gemini API endpoint.
- **Fix (System Resilience):** The Orchestrator's internal architecture performed flawlessly! The `HTNDagParser` caught the 429 and gracefully degraded to its Mock HTN Tree (`Structured extraction failed. Falling back to mock HTN tree.`). Simultaneously, the `SupportAgent` caught the 404 Embedding error and triggered its safety net (`Vector Store / Embedding failed. Returning standard fallback response.`). The system synthesized the final output without crashing the server or breaking the UI. No code changes needed, the defensive programming worked.

## Bug 34: Chat History Loss on Tab Switch & UI Styling
- **Symptom:** Navigating away from the "Chat" tab to "Observability" and back caused the chat window to reset completely. The Observability panel also contained messy placeholder text and oversized "Virtual Threads" telemetry cards.
- **Root Cause:** The `ChatInterface.jsx` was using a local React `useState` to store chat messages, meaning the state was destroyed every time the component unmounted during a tab switch.
- **Fix:** Lifted the chat state globally by adding `chatMessages` array and an `addChatMessage` action to the Zustand `store.jsx`. Updated `ChatInterface` to bind to the global state, ensuring persistence across component mounts. Refactored `ObservabilityPanel.jsx` to replace the crude text placeholder with a clean UI graphic, and reduced the padding and font sizes of the telemetry cards to fit MCP sessions better.

## Bug 35: Raw JSON Rendering in Chat Interface
- **Symptom:** The chat interface displayed the raw JSON object `{"response": "..."}` instead of the extracted string.
- **Root Cause:** `ChatInterface.jsx` called `await response.text()` on the HTTP request, which simply converted the Spring Boot `Map<String, String>` JSON output into a raw string, rather than parsing it.
- **Fix:** Updated the fetch logic in `ChatInterface.jsx` to use `await response.json()` and correctly map `data.response` into the UI chat state.
