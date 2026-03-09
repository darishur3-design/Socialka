package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.EventPassport;
import ru.nngasu.socialka.model.User;
import ru.nngasu.socialka.repository.EventRepository;
import ru.nngasu.socialka.repository.UserRepository;
import ru.nngasu.socialka.service.FirebaseService;
import ru.nngasu.socialka.service.QRCodeService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class EventParticipantController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final FirebaseService firebaseService;
    private final QRCodeService qrCodeService;

    public EventParticipantController(EventRepository eventRepository,
                                      UserRepository userRepository,
                                      FirebaseService firebaseService,
                                      QRCodeService qrCodeService) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.firebaseService = firebaseService;
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/{eventId}/participant-qr")
    public ResponseEntity<?> getParticipantQR(
            @PathVariable Integer eventId,
            @RequestHeader("Authorization") String token) {
        try {
            System.out.println("Generating QR for event: " + eventId);

            // Проверяем авторизацию
            String cleanToken = token.replace("Bearer ", "");
            String uid = firebaseService.verifyToken(cleanToken);

            Optional<User> userOpt = userRepository.findByAuthUid(uid);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Пользователь не найден"));
            }

            User user = userOpt.get();
            Integer userId = user.getId().intValue();

            // Загружаем мероприятие
            Optional<EventPassport> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Мероприятие не найдено"));
            }

            EventPassport event = eventOpt.get();

            // Генерируем уникальные данные для QR-кода
            String qrData = qrCodeService.createQRData(eventId, userId);

            // Сохраняем токен в БД (если нужно для проверки)
            event.setQrToken(qrData);
            eventRepository.save(event);

            // Генерируем изображение QR-кода
            String qrBase64 = qrCodeService.generateQRCodeBase64(qrData, 300, 300);

            Map<String, Object> response = new HashMap<>();
            response.put("qrCode", "data:image/png;base64," + qrBase64);
            response.put("qrData", qrData);
            response.put("eventId", eventId);
            response.put("userId", userId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Эндпоинт для проверки QR-кода (например, на входе)
    @PostMapping("/verify-qr")
    public ResponseEntity<?> verifyQR(@RequestBody Map<String, String> body) {
        try {
            String qrData = body.get("qrData");
            // Здесь логика проверки QR-кода
            // Можно проверить, существует ли такой токен в БД
            return ResponseEntity.ok(Map.of("valid", true, "message", "QR-код действителен"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}