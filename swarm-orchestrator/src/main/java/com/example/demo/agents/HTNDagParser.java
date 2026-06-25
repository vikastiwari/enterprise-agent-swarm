package com.example.demo.agents;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Component
@Slf4j
public class HTNDagParser {

    private final ChatClient chatClient;

    public HTNDagParser(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultSystem("You are a Hierarchical Task Network (HTN) DAG parser. Break the user intent into a sequence of structured agent tasks. " +
                        "IMPORTANT: You MUST ONLY use the following exact agent names: 'BillingAgent' (for balance, payments, money) and 'SupportAgent' (for technical issues, passwords, general help).")
                .build();
    }

    public record Task(String agent, String instruction) {}
    public record DagPlan(List<Task> tasks) {}

    public DagPlan parse(String intent) {
        try {
            log.info("[HTN Parser] Generating DAG for intent: {}", intent);
            return chatClient.prompt()
                    .user(intent)
                    .call()
                    .entity(DagPlan.class);
        } catch (Exception e) {
            log.warn("[HTN Parser] Structured extraction failed (Likely invalid OpenAI key). Falling back to mock HTN tree.");
            if (intent.toLowerCase().contains("balance") && intent.toLowerCase().contains("password")) {
                return new DagPlan(List.of(
                    new Task("BillingAgent", "Get billing balance"),
                    new Task("SupportAgent", "Reset EC2 password")
                ));
            } else if (intent.toLowerCase().contains("balance")) {
                return new DagPlan(List.of(new Task("BillingAgent", intent)));
            } else {
                return new DagPlan(List.of(new Task("SupportAgent", intent)));
            }
        }
    }
}
