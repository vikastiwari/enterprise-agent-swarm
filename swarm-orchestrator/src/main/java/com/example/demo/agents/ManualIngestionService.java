package com.example.demo.agents;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManualIngestionService {

    private static final Logger logger = LoggerFactory.getLogger(ManualIngestionService.class);
    
    private final VectorStore vectorStore;

    public ManualIngestionService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @PostConstruct
    public void ingestManuals() {
        logger.info("Initializing Enterprise GraphRAG Ingestion...");

        String manualText = """
                ENTERPRISE IT MANUAL
                
                TOPIC: EC2 Password Reset
                If a customer needs to reset their EC2 password, they must first log into the AWS Management Console.
                Navigate to the EC2 Dashboard, select the instance, and click 'Actions' -> 'Security' -> 'Get Windows Password'.
                They will need the original key pair (.pem) file to decrypt the new password.
                If the instance is Linux, they must SSH using the key pair. If the key is lost, they must detach the EBS volume, 
                attach it to a recovery instance, and modify the authorized_keys file.
                
                TOPIC: Server Overheating
                If the server is overheating, check the cooling system and ensure the server room temperature is below 72F.
                """;

        Document document = new Document(manualText);
        TokenTextSplitter textSplitter = new TokenTextSplitter();
        List<Document> splitDocuments = textSplitter.apply(List.of(document));

        logger.info("Writing {} chunks to Neo4j Vector Store...", splitDocuments.size());
        try {
            vectorStore.add(splitDocuments);
            logger.info("Ingestion complete!");
        } catch (Exception e) {
            logger.warn("Ingestion failed (Check OPENAI_API_KEY): {}", e.getMessage());
        }
    }
}
