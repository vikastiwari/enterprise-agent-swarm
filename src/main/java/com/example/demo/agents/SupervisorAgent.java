package com.example.demo.agents;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
public class SupervisorAgent {

    private final ChatClient chatClient;
    private final SupportAgent supportAgent;

    public SupervisorAgent(ChatClient.Builder chatClientBuilder, SupportAgent supportAgent) {
        this.supportAgent = supportAgent;
        this.chatClient = chatClientBuilder
            .defaultSystem("You are the Chief AI Supervisor. Your job is to orchestrate tasks. " +
                           "You have access to the 'getCustomerBillingInfo' tool to resolve billing questions. " +
                           "If the user asks a billing question, use the tool. Provide a unified, polite response.")
            .defaultFunctions("getCustomerBillingInfo")
            .build();
    }

    public String orchestrateUserRequest(String customerId, String request) {
        log.info("[Supervisor] Received request from Customer {}: {}", customerId, request);
        
        // Let's use Java 21 Virtual Threads (CompletableFuture runs on virtual threads if configured)
        // For simplicity here, we split logic. If request contains tech support keywords, delegate.
        
        CompletableFuture<String> supportTask = CompletableFuture.supplyAsync(() -> {
            if (request.toLowerCase().contains("password") || request.toLowerCase().contains("login") || request.toLowerCase().contains("server")) {
                return supportAgent.resolveIssue(request);
            }
            return "";
        });

        CompletableFuture<String> billingTask = CompletableFuture.supplyAsync(() -> {
            return chatClient.prompt()
                    .user("Customer ID: " + customerId + "\nUser Request: " + request)
                    .call()
                    .content();
        });

        try {
            String supportResponse = supportTask.get();
            String billingResponse = billingTask.get();
            
            StringBuilder finalResponse = new StringBuilder();
            if (!billingResponse.isEmpty()) {
                finalResponse.append(billingResponse).append("\n\n");
            }
            if (!supportResponse.isEmpty()) {
                finalResponse.append("**Tech Support Notes:**\n").append(supportResponse);
            }
            return finalResponse.toString();
            
        } catch (InterruptedException | ExecutionException e) {
            log.error("Orchestration failed", e);
            return "Apologies, the Enterprise Swarm encountered an error resolving your request.";
        }
    }
}
