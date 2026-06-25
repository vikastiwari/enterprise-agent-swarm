package com.example.demo;

import com.example.demo.agents.SupportAgent;
import com.example.demo.agents.SupervisorAgent;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class SupervisorAgentTest {

    @Autowired
    private SupervisorAgent supervisorAgent;

    @MockBean
    private org.springframework.ai.chat.model.ChatModel chatModel;
    
    @MockBean
    private SupportAgent supportAgent;

    @Test
    void testSupervisorRoutesToSupport() {
        // Mock the support agent response
        when(supportAgent.resolveIssue(any(String.class)))
            .thenReturn("Mocked IT Manual: To reset an EC2 password, navigate to Security Hub.");

        // Simulate a customer asking a technical question
        String request = "How do I reset my EC2 password?";
        String customerId = "CUST-1001";

        // We mock the LLM ChatModel to echo the context it gets so we can assert the context
        when(chatModel.call(any(Prompt.class)))
            .thenAnswer(invocation -> {
                Prompt p = invocation.getArgument(0);
                return new ChatResponse(List.of(new Generation(p.getContents())));
            });
        
        String response = supervisorAgent.orchestrateUserRequest(customerId, request);

        // Verify the response contains the tech support notes from the supportAgent mock
        assertTrue(response.contains("Mocked IT Manual:"));
    }
}
