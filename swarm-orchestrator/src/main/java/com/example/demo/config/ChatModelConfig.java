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
        
        String geminiKey = env.getProperty("GEMINI_API_KEY");
        if (geminiKey != null && !geminiKey.trim().isEmpty()) {
            log.info("GEMINI_API_KEY is present. Looking for Gemini ChatModel...");
            for (ChatModel model : chatModels) {
                if (model.getClass().getSimpleName().contains("GoogleGenAi") || model.getClass().getSimpleName().contains("VertexAi")) {
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
        
        String geminiKey = env.getProperty("GEMINI_API_KEY");
        if (geminiKey != null && !geminiKey.trim().isEmpty()) {
            log.info("GEMINI_API_KEY is present. Looking for Gemini EmbeddingModel...");
            for (EmbeddingModel model : embeddingModels) {
                if (model.getClass().getSimpleName().contains("GoogleGenAi") || model.getClass().getSimpleName().contains("VertexAi")) {
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
