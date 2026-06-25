package com.example.demo.agents;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SupportAgent {

    private final ChatClient chatClient;

    public SupportAgent(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
            .defaultSystem("You are a Tier 2 Enterprise Tech Support Agent. You have access to the IT manual. " +
                           "Answer technical queries precisely and concisely.")
            .build();
    }

    public String resolveIssue(String technicalQuery) {
        log.info("[Support Agent] Analyzing technical query: {}", technicalQuery);
        // Mocking RAG search for IT Manual
        String retrievedContext = "Mock IT Manual: To reset an EC2 password or IAM credentials, navigate to the AWS Console Security Hub and click 'Force Reset'.";
        
        return chatClient.prompt()
                .user("User Query: " + technicalQuery + "\n\nRetrieved Context: " + retrievedContext)
                .call()
                .content();
    }
}
