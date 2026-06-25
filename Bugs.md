# Enterprise Agent Swarm: Bug Tracking & Fixes

This document tracks all bugs encountered during the end-to-end testing phase and their corresponding resolutions.

## 1. Maven Execution Context Error
- **Issue:** User ran `mvn test` in the `/home/vikas/Projects` directory, resulting in `MissingProjectException` (No POM in directory).
- **Fix:** Switched context to the correct directory: `/home/vikas/Projects/enterprise-agent-swarm`.

## 2. Spring Boot 3.4 Testing Annotation Deprecation
- **Issue:** `mvn test` failed with `cannot find symbol class MockBean`. Spring Boot 3.4.x completely removed `@MockBean` from the `org.springframework.boot.test.mock.mockito` package.
- **Fix:** Refactored `SupervisorAgentTest.java` to use the new standard `@MockitoBean` from `org.springframework.test.context.bean.override.mockito.MockitoBean`.

## 3. RestClientAutoConfiguration ClassNotFoundException
- **Issue:** The application context failed to load because it was trying to initialize `RestClientAutoConfiguration`, but it was missing from the classpath. This was caused by an experimental/unreleased Spring Boot parent version (`4.1.0`) injected by `start.spring.io` default curl.
- **Fix:** Explicitly downgraded `<version>4.1.0</version>` to `<version>3.4.0</version>` inside `pom.xml`, and added `spring-boot-starter-web` and `spring-boot-starter-test` for comprehensive REST testing.

## 4. Spring Cloud Function Context Configuration Error
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
- **Fix:** Changed `hibernate.ddl-auto` from `update` to `create-drop` in `application.yml` so that tables are dropped and recreated correctly for each fresh Spring Context.
