package com.example.demo;

import com.example.demo.security.DebateResolver;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class DebateResolverTest {

    private final DebateResolver resolver = new DebateResolver();

    @Test
    void testBillingAgentWinsDebate() {
        String result = resolver.resolveConflict(
                "BillingAgent", "Balance is $100", 
                "SupportAgent", "Cannot check balance"
        );
        
        // BillingAgent has a 95% expected probability vs SupportAgent's 90% expected probability
        // So BillingAgent should win mathematically.
        assertEquals("Balance is $100", result);
    }
    
    @Test
    void testSupportAgentWinsAgainstUnknown() {
        String result = resolver.resolveConflict(
                "UnknownAgent", "I don't know", 
                "SupportAgent", "Reset EC2 password"
        );
        
        // UnknownAgent has a 50% expected probability vs SupportAgent's 90%
        // SupportAgent should win mathematically.
        assertEquals("Reset EC2 password", result);
    }
}
