package com.kernel.controller;

import com.kernel.service.GeminiAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiChatController {

    private final GeminiAiService geminiAiService;

    public AiChatController(GeminiAiService geminiAiService) {
        this.geminiAiService = geminiAiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chatWithAssistant(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "");
        if (message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("response", "Please provide a valid question or hardware prompt."));
        }
        String aiResponse = geminiAiService.generateResponse(message);
        return ResponseEntity.ok(Map.of("response", aiResponse));
    }
}
