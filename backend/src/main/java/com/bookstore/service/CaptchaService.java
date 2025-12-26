package com.bookstore.service;

import com.bookstore.dto.CaptchaResponse;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class CaptchaService {

    private final Map<String, Integer> captchaStore = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public CaptchaResponse generateCaptcha() {
        int num1 = (int) (Math.random() * 10);
        int num2 = (int) (Math.random() * 10);
        String operation = Math.random() > 0.5 ? "+" : "-";

        // Ensure positive result for subtraction
        if (operation.equals("-") && num1 < num2) {
            int temp = num1;
            num1 = num2;
            num2 = temp;
        }

        int answer = operation.equals("+") ? num1 + num2 : num1 - num2;
        String question = num1 + " " + operation + " " + num2 + " = ?";
        String id = UUID.randomUUID().toString();

        captchaStore.put(id, answer);

        // Expire after 5 minutes
        scheduler.schedule(() -> captchaStore.remove(id), 5, TimeUnit.MINUTES);

        return new CaptchaResponse(id, question);
    }

    public boolean validateCaptcha(String id, String answer) {
        if (id == null || answer == null || !captchaStore.containsKey(id)) {
            return false;
        }

        try {
            int parsedAnswer = Integer.parseInt(answer.trim());
            Integer expectedAnswer = captchaStore.get(id);

            // Remove after validation to prevent reuse
            captchaStore.remove(id);

            return expectedAnswer != null && expectedAnswer.equals(parsedAnswer);
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
