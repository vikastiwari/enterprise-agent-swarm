package com.example.demo.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VectorStoreConfig {

    @Bean
    public VectorStore vectorStore(java.util.List<EmbeddingModel> embeddingModels) {
        EmbeddingModel geminiModel = embeddingModels.stream()
            .filter(model -> model.getClass().getSimpleName().toLowerCase().contains("google") || 
                             model.getClass().getSimpleName().toLowerCase().contains("gemini") || 
                             model.getClass().getSimpleName().toLowerCase().contains("vertex"))
            .findFirst()
            .orElse(embeddingModels.get(0));
        return SimpleVectorStore.builder(geminiModel).build();
    }
}
