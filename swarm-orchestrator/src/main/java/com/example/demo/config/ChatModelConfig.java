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
            @Qualifier("googleGenAiChatModel") org.springframework.beans.factory.ObjectProvider<ChatModel> geminiChatModelProvider,
            @Qualifier("openAiChatModel") org.springframework.beans.factory.ObjectProvider<ChatModel> openAiChatModelProvider) {
        
        String geminiKey = env.getProperty("GEMINI_API_KEY");
        if (geminiKey != null && !geminiKey.trim().isEmpty()) {
            log.info("GEMINI_API_KEY is present. Using Gemini as the Primary ChatModel.");
            return geminiChatModelProvider.getIfAvailable();
        } else {
            log.info("GEMINI_API_KEY is missing. Falling back to OpenAI as the Primary ChatModel.");
            return openAiChatModelProvider.getIfAvailable();
        }
    }

    @Bean
    @Primary
    public EmbeddingModel primaryEmbeddingModel(
            Environment env,
            @Qualifier("googleGenAiEmbeddingModel") org.springframework.beans.factory.ObjectProvider<EmbeddingModel> geminiEmbeddingProvider,
            @Qualifier("openAiEmbeddingModel") org.springframework.beans.factory.ObjectProvider<EmbeddingModel> openAiEmbeddingProvider) {
        
        String geminiKey = env.getProperty("GEMINI_API_KEY");
        if (geminiKey != null && !geminiKey.trim().isEmpty()) {
            log.info("GEMINI_API_KEY is present. Using Gemini as the Primary EmbeddingModel.");
            return geminiEmbeddingProvider.getIfAvailable();
        } else {
            log.info("GEMINI_API_KEY is missing. Falling back to OpenAI as the Primary EmbeddingModel.");
            return openAiEmbeddingProvider.getIfAvailable();
        }
    }
}
