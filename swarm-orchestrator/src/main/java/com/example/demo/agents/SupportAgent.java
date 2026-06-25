package com.example.demo.agents;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
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
            .defaultAdvisors(new QuestionAnswerAdvisor(vectorStore, org.springframework.ai.vectorstore.SearchRequest.defaults()))
            .build();
    }

    public String resolveIssue(String technicalQuery) {
        log.info("[Support Agent] Analyzing technical query via Vector Store: {}", technicalQuery);
        
        return chatClient.prompt()
                .user(technicalQuery)
                .call()
                .content();
    }
}
