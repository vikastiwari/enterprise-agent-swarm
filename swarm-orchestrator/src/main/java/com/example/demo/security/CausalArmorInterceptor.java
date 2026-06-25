package com.example.demo.security;

import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Component
@Slf4j
public class CausalArmorInterceptor {

    // Simple heuristic-based list for IPI defense
    private static final List<String> MALICIOUS_PATTERNS = List.of(
            "ignore previous instructions",
            "system prompt",
            "drop table",
            "you are now",
            "bypass safety"
    );

    public boolean isSafe(String input) {
        if (input == null || input.isBlank()) return true;
        
        String normalizedInput = input.toLowerCase();
        
        for (String pattern : MALICIOUS_PATTERNS) {
            if (normalizedInput.contains(pattern)) {
                log.warn("[CausalArmor] Indirect Prompt Injection (IPI) detected! Pattern matched: '{}'", pattern);
                return false;
            }
        }
        
        return true;
    }
}
