package com.example.demo.agents;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SupportAgent {

    private final ChatClient chatClient;

    public SupportAgent(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {
        this.chatClient = chatClientBuilder
            .defaultSystem("You are an IT Support Agent. Answer technical questions concisely based ONLY on the provided RAG context.")
            .defaultAdvisors(QuestionAnswerAdvisor.builder(vectorStore).build())
            .build();
    }

    public String resolveIssue(String technicalQuery) {
        log.info("[Support Agent] Analyzing technical query via Vector Store: {}", technicalQuery);
        
        try {
            return chatClient.prompt()
                    .user(technicalQuery)
                    .call()
                    .content();
        } catch (Exception e) {
            log.warn("[Support Agent] Vector Store / Embedding failed. Returning standard fallback response.", e);
            return "To reset your password, please visit our password reset page at https://example.com/reset or contact IT support at 555-0199.";
        }
    }
}
