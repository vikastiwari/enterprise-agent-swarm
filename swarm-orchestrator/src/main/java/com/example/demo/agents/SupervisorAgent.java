package com.example.demo.agents;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class SupervisorAgent {

    private final SupportAgent supportAgent;
    private final ChatClient chatClient;
    private final HTNDagParser htnDagParser;
    private final EventLogRepository eventLogRepository;

    public SupervisorAgent(SupportAgent supportAgent, ChatClient.Builder chatClientBuilder, HTNDagParser htnDagParser, EventLogRepository eventLogRepository) {
        this.supportAgent = supportAgent;
        this.htnDagParser = htnDagParser;
        this.eventLogRepository = eventLogRepository;
        this.chatClient = chatClientBuilder
            .defaultSystem("You are the Supervisor Agent. Given sub-task results, generate a final coherent response to the user.")
            .build();
    }

    private void logEvent(String action, String payload) {
        DpmEvent event = new DpmEvent();
        event.setAgentName("SupervisorAgent");
        event.setAction(action);
        event.setPayload(payload);
        eventLogRepository.save(event);
    }

    public String orchestrateUserRequest(String customerId, String request) {
        logEvent("RECEIVED_INTENT", "Customer " + customerId + " requested: " + request);
        log.info("[Supervisor] Orchestrating request for {}: {}", customerId, request);

        // 1. Parse intent into an HTN DAG
        HTNDagParser.DagPlan plan = htnDagParser.parse(request);
        logEvent("HTN_DAG_GENERATED", "Tasks: " + plan.tasks().size());

        StringBuilder combinedContext = new StringBuilder();

        // 2. Execute tasks concurrently
        CompletableFuture<?>[] futures = plan.tasks().stream().map(task -> 
            CompletableFuture.supplyAsync(() -> {
                String result = "";
                logEvent("DISPATCH_TASK", "Agent: " + task.agent() + " | Task: " + task.instruction());
                
                if (task.agent().equals("BillingAgent")) {
                    // For now, simulate BillingAgent MCP call
                    result = "Billing Data: Balance is $120.50";
                } else if (task.agent().equals("SupportAgent")) {
                    result = supportAgent.resolveIssue(task.instruction());
                }
                
                logEvent("TASK_COMPLETE", "Agent: " + task.agent() + " | Result: " + result);
                return result;
            }).thenAccept(res -> {
                synchronized(combinedContext) {
                    combinedContext.append(res).append("\n");
                }
            })
        ).toArray(CompletableFuture[]::new);

        CompletableFuture.allOf(futures).join();

        logEvent("GENERATING_RESPONSE", "Synthesizing final output");
        
        try {
            return chatClient.prompt()
                    .user("Customer Request: " + request + "\n\nSub-Agent Context:\n" + combinedContext.toString())
                    .call()
                    .content();
        } catch (Exception e) {
            log.warn("[Supervisor] LLM synthesis failed. Returning raw context.");
            return "Supervisor Synthesis Fallback:\n" + combinedContext.toString();
        }
    }
}
