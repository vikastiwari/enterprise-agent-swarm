package com.example.demo.controller;

import com.example.demo.agents.SupervisorAgent;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final SupervisorAgent supervisorAgent;

    @PostMapping
    public Map<String, String> handleChat(@RequestBody Map<String, String> payload) {
        String customerId = payload.getOrDefault("customerId", "CUST-1001");
        String message = payload.get("message");
        
        try {
            String response = supervisorAgent.orchestrateUserRequest(customerId, message);
            return Map.of("response", response != null ? response : "Empty response from Supervisor");
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", e.getClass().getName() + ": " + e.getMessage());
        }
    }
}
