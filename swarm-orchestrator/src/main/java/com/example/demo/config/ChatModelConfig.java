package com.example.demo.config;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class ChatModelConfig {

    @Bean
    @Primary
    public ChatModel primaryChatModel(
            Environment env,
            java.util.List<ChatModel> chatModels) {
        
        log.info("Available ChatModels:");
        for (ChatModel m : chatModels) {
            log.info("- " + m.getClass().getSimpleName() + " (" + m.getClass().getName() + ")");
        }

        String geminiKey = env.getProperty("GEMINI_API_KEY");
        if (geminiKey != null && !geminiKey.trim().isEmpty()) {
            log.info("GEMINI_API_KEY is present. Looking for Gemini ChatModel...");
            for (ChatModel model : chatModels) {
                if (model.getClass().getSimpleName().toLowerCase().contains("google") || 
                    model.getClass().getSimpleName().toLowerCase().contains("gemini") || 
                    model.getClass().getSimpleName().toLowerCase().contains("vertex")) {
                    log.info("Found Gemini ChatModel: " + model.getClass().getSimpleName());
                    return model;
                }
            }
        }
        
        log.info("Falling back to OpenAI ChatModel...");
        return chatModels.stream()
                .filter(m -> m.getClass().getSimpleName().contains("OpenAi"))
                .findFirst()
                .orElse(chatModels.get(0));
    }

    @Bean
    @Primary
    public EmbeddingModel primaryEmbeddingModel(
            Environment env,
            java.util.List<EmbeddingModel> embeddingModels) {
        
        log.info("Available EmbeddingModels:");
        for (EmbeddingModel m : embeddingModels) {
            log.info("- " + m.getClass().getSimpleName() + " (" + m.getClass().getName() + ")");
        }

        String geminiKey = env.getProperty("GEMINI_API_KEY");
        if (geminiKey != null && !geminiKey.trim().isEmpty()) {
            log.info("GEMINI_API_KEY is present. Looking for Gemini EmbeddingModel...");
            for (EmbeddingModel model : embeddingModels) {
                if (model.getClass().getSimpleName().toLowerCase().contains("google") || 
                    model.getClass().getSimpleName().toLowerCase().contains("gemini") || 
                    model.getClass().getSimpleName().toLowerCase().contains("vertex")) {
                    log.info("Found Gemini EmbeddingModel: " + model.getClass().getSimpleName());
                    return model;
                }
            }
        }
        
        log.info("Falling back to OpenAI EmbeddingModel...");
        return embeddingModels.stream()
                .filter(m -> m.getClass().getSimpleName().contains("OpenAi"))
                .findFirst()
                .orElse(embeddingModels.get(0));
    }
}
