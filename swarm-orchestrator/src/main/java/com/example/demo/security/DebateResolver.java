package com.example.demo.security;

import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;

@Component
@Slf4j
public class DebateResolver {

    // Hardcoded historical weights (alpha, beta parameters for Beta distribution)
    // Alpha = historical successes, Beta = historical failures
    private final Map<String, AgentReliability> agentPriors = Map.of(
            "SupportAgent", new AgentReliability(90.0, 10.0),
            "BillingAgent", new AgentReliability(95.0, 5.0)
    );

    public record AgentReliability(double alpha, double beta) {
        public double getExpectedProbability() {
            return alpha / (alpha + beta);
        }
    }

    public String resolveConflict(String agent1Name, String agent1Context, String agent2Name, String agent2Context) {
        log.info("[DebateResolver] Conflict detected between {} and {}. Applying Beta-Binomial Mixture Model.", agent1Name, agent2Name);

        AgentReliability prior1 = agentPriors.getOrDefault(agent1Name, new AgentReliability(50.0, 50.0));
        AgentReliability prior2 = agentPriors.getOrDefault(agent2Name, new AgentReliability(50.0, 50.0));

        double prob1 = prior1.getExpectedProbability();
        double prob2 = prior2.getExpectedProbability();

        log.debug("[DebateResolver] {} probability: {}. {} probability: {}", agent1Name, prob1, agent2Name, prob2);

        if (prob1 >= prob2) {
            log.info("[DebateResolver] {} wins debate mathematically.", agent1Name);
            return agent1Context;
        } else {
            log.info("[DebateResolver] {} wins debate mathematically.", agent2Name);
            return agent2Context;
        }
    }
}
