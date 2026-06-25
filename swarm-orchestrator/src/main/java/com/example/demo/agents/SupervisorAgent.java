package com.example.demo.agents;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import com.example.demo.security.CausalArmorInterceptor;
import com.example.demo.security.DebateResolver;

import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class SupervisorAgent {

    private final SupportAgent supportAgent;
    private final ChatClient chatClient;
    private final ChatClient billingChatClient;
    private final HTNDagParser htnDagParser;
    private final EventLogRepository eventLogRepository;
    private final CausalArmorInterceptor causalArmor;
    private final DebateResolver debateResolver;

    public SupervisorAgent(SupportAgent supportAgent, ChatClient.Builder chatClientBuilder, HTNDagParser htnDagParser, EventLogRepository eventLogRepository, CausalArmorInterceptor causalArmor, DebateResolver debateResolver, java.util.List<org.springframework.ai.tool.ToolCallback> tools) {
        this.supportAgent = supportAgent;
        this.htnDagParser = htnDagParser;
        this.eventLogRepository = eventLogRepository;
        this.causalArmor = causalArmor;
        this.debateResolver = debateResolver;
        this.chatClient = chatClientBuilder
            .defaultSystem("You are the Supervisor Agent. Given sub-task results, generate a final coherent response to the user.")
            .build();
        this.billingChatClient = chatClientBuilder
            .defaultSystem("You are the Billing Agent. Provide concise billing information by using the billing tools available. IMPORTANT: You must always include a short text message (like 'Checking billing info...') in your response BEFORE invoking any tools, to prevent parsing errors.")
            .defaultToolCallbacks(tools)
            .build();
    }

    private void logEvent(String action, String payload) {
        log.info("[Supervisor Event] {} | {}", action, payload);
        DpmEvent event = new DpmEvent();
        event.setAgentName("SupervisorAgent");
        event.setAction(action);
        event.setPayload(payload);
        eventLogRepository.save(event);
    }

    public String orchestrateUserRequest(String customerId, String request) {
        logEvent("RECEIVED_INTENT", "Customer " + customerId + " requested: " + request);
        log.info("[Supervisor] Orchestrating request for {}: {}", customerId, request);

        // Security Layer: CausalArmor Interception
        if (!causalArmor.isSafe(request)) {
            logEvent("SECURITY_BLOCK", "IPI Detected in input");
            return "Security Alert: Your request was blocked by CausalArmor due to policy violations.";
        }

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
                    result = billingChatClient.prompt()
                                .user("Invoke billing info tool for customer " + customerId)
                                .call()
                                .content();
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

        // Simulate conflict detection & debate resolution if multiple tasks occurred
        String finalContext = combinedContext.toString();
        if (plan.tasks().size() > 1 && finalContext.contains("Billing Data") && finalContext.contains("Support")) {
            logEvent("DEBATE_DETECTED", "Resolving potential conflict via Beta-Binomial Mixture Model");
            // Hardcoded resolution simulation: in a real scenario we'd pass their specific claims
            String resolvedContext = debateResolver.resolveConflict("BillingAgent", "Billing Data: Balance is $120.50", "SupportAgent", "Support context: " + finalContext);
            finalContext = "Debate Winner Context: " + resolvedContext + "\nCombined: " + finalContext;
        }

        logEvent("GENERATING_RESPONSE", "Synthesizing final output");
        
        try {
            return chatClient.prompt()
                    .user("Customer Request: " + request + "\n\nSub-Agent Context:\n" + finalContext)
                    .call()
                    .content();
        } catch (Exception e) {
            log.warn("[Supervisor] LLM synthesis failed. Returning raw context.");
            return "Supervisor Synthesis Fallback:\n" + finalContext;
        }
    }
}
