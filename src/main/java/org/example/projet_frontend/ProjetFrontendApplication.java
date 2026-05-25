package org.example.projet_frontend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class ProjetFrontendApplication {

    public static void main(String[] args) {
        // Native .env loader
        try {
            if (Files.exists(Paths.get(".env"))) {
                List<String> lines = Files.readAllLines(Paths.get(".env"));
                for (String line : lines) {
                    if (line != null && line.contains("=") && !line.startsWith("#")) {
                        String[] parts = line.split("=", 2);
                        String key = parts[0].trim();
                        String value = parts[1].trim();
                        System.setProperty(key, value);
                        System.out.println("Loaded env: " + key);
                    }
                }
            } else {
                System.out.println(".env file not found at " + Paths.get(".env").toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("Warning: Could not read .env file: " + e.getMessage());
        }

        SpringApplication.run(ProjetFrontendApplication.class, args);
    }
}
