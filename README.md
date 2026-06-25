# 🚀 Enterprise Multi-Agent Orchestrator (Spring AI)

![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.0-brightgreen.svg)
![Spring AI](https://img.shields.io/badge/Spring_AI-1.0.0--M1-blue.svg)
![Concurrency](https://img.shields.io/badge/Project_Loom-Virtual_Threads-purple.svg)

## Overview
A production-grade **Chief AI Officer** microservice designed to handle complex, multi-intent customer queries by orchestrating specialized AI Agents. 

This system bridges legacy JVM enterprise architectures with modern Generative AI by utilizing **Java 21 Virtual Threads** for massive concurrency and **Spring AI** for robust Agent/LLM abstractions.

## 📚 Documentation
For a deep dive into the architecture and components, please review the following:
- [Architecture Design](docs/ARCHITECTURE.md)
- [Component Specifications](docs/COMPONENTS.md)
- [Communication & IPC Strategy](docs/COMMUNICATION.md)
- [UI/UX Dashboard Blueprint](docs/UI_UX_DESIGN.md)
- [Project Roadmap](docs/ROADMAP.md)
- [Bug Tracking](docs/Bugs.md)

## 🧠 Architecture: The "Enterprise Swarm"
When a user submits a query, the system does not rely on a single, hallucination-prone monolithic LLM. Instead, it utilizes an Orchestrator pattern:

1. **Supervisor Agent (`SupervisorAgent.java`)**: The master orchestrator. It intercepts natural language requests, breaks them down, and distributes sub-tasks concurrently to specialized worker agents using `CompletableFuture` running on Java 21 Virtual Threads.
2. **Billing MCP Server (Sandboxed)**: A specialized worker agent extracted into its own standalone microservice module. It uses the Model Context Protocol (MCP) to expose database queries (H2) without giving the Orchestrator direct data access.
3. **Support Agent (RAG)**: A specialized worker agent dedicated to parsing IT Manuals and documentation to provide deterministic tech support.

```mermaid
graph TD;
    User([User Request]) -->|REST Endpoint| SwarmOrchestrator[Swarm Orchestrator]
    
    subgraph Multi-Module Architecture
        SwarmOrchestrator
        BillingMCPServer[Billing MCP Server]
        Support[Tech Support Agent]
        
        SwarmOrchestrator -- Concurrently Routes --> BillingClient
        SwarmOrchestrator -- Concurrently Routes --> Support
        
        BillingClient -.->|MCP Protocol| BillingMCPServer
        BillingMCPServer -.->|JPA| DB[(H2 SQL Database)]
        Support -.->|RAG| VectorDB[(Vector Store)]
    end
```

## 🛠️ Key Technologies
- **Spring AI:** Abstracted chat clients and prompt engineering.
- **Function Calling:** Defined via standard Java `@Bean` and `@Description` annotations, seamlessly translated into LLM tools.
- **JPA & H2 In-Memory DB:** Secure sandbox for the Billing Agent.
- **Java 21 Project Loom:** Non-blocking Virtual Threads to ensure the Supervisor can handle hundreds of concurrent agent conversations without OS thread starvation.

## 🚀 Quick Start
1. Add your OpenAI API key to `swarm-orchestrator/src/main/resources/application.yml` (or export it as `OPENAI_API_KEY`).
2. Build the entire multi-module project:
   ```bash
   ./mvnw clean install -DskipTests
   ```
3. Boot up the **Billing MCP Server**:
   ```bash
   cd billing-mcp-server
   ../mvnw spring-boot:run
   ```
4. In a separate terminal, boot up the **Swarm Orchestrator**:
   ```bash
   cd swarm-orchestrator
   ../mvnw spring-boot:run
   ```
5. Test the Multi-Agent Orchestrator via REST:
   ```bash
   curl -X POST http://localhost:8080/api/chat \
   -H "Content-Type: application/json" \
   -d '{"customerId":"CUST-1001", "message":"Why is my bill so high, and how do I reset my EC2 password?"}'
   ```
