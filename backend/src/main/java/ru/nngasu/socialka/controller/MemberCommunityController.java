package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.MemberCommunity;
import ru.nngasu.socialka.repository.MemberCommunityRepository;
import ru.nngasu.socialka.service.FirebaseService;
import ru.nngasu.socialka.service.UserService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/members_communities")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class MemberCommunityController {

    private final MemberCommunityRepository memberCommunityRepository;
    private final FirebaseService firebaseService;
    private final UserService userService;

    public MemberCommunityController(MemberCommunityRepository memberCommunityRepository,
                                     FirebaseService firebaseService,
                                     UserService userService) {
        this.memberCommunityRepository = memberCommunityRepository;
        this.firebaseService = firebaseService;
        this.userService = userService;
    }

    // Получить все членства пользователя
    @GetMapping("/user")
    public ResponseEntity<?> getUserMemberships(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("Getting user memberships with token: " + token.substring(0, Math.min(20, token.length())) + "...");

            String cleanToken = token.replace("Bearer ", "");
            String uid = firebaseService.verifyToken(cleanToken);
            System.out.println("Verified UID: " + uid);

            Integer userId = userService.getUserIdByFirebaseUid(uid);
            System.out.println("User ID from DB: " + userId);

            if (userId == null) {
                return ResponseEntity.ok(List.of());
            }

            List<MemberCommunity> memberships = memberCommunityRepository.findByUserId(userId);
            return ResponseEntity.ok(memberships);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(Map.of("error", "Не авторизован: " + e.getMessage()));
        }
    }

    // Проверить, состоит ли пользователь в сообществе
    @GetMapping("/check")
    public ResponseEntity<?> checkMembership(
            @RequestHeader("Authorization") String token,
            @RequestParam Integer community_id) {
        try {
            System.out.println("Checking membership for community: " + community_id);

            String cleanToken = token.replace("Bearer ", "");
            String uid = firebaseService.verifyToken(cleanToken);

            Integer userId = userService.getUserIdByFirebaseUid(uid);
            if (userId == null) {
                return ResponseEntity.ok(false);
            }

            boolean exists = memberCommunityRepository.existsByUserIdAndCommunityId(userId, community_id);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(Map.of("error", "Не авторизован"));
        }
    }

    // Вступить в сообщество
    @PostMapping
    public ResponseEntity<?> joinCommunity(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> payload) {
        try {
            System.out.println("Join community payload: " + payload);

            String cleanToken = token.replace("Bearer ", "");
            String uid = firebaseService.verifyToken(cleanToken);

            Integer userId = userService.getUserIdByFirebaseUid(uid);
            if (userId == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Пользователь не найден"));
            }

            // Извлекаем community_id из payload
            Object communityIdObj = payload.get("community_id");
            if (communityIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "community_id не указан"));
            }

            Integer communityId;
            if (communityIdObj instanceof Integer) {
                communityId = (Integer) communityIdObj;
            } else if (communityIdObj instanceof String) {
                communityId = Integer.parseInt((String) communityIdObj);
            } else if (communityIdObj instanceof Number) {
                communityId = ((Number) communityIdObj).intValue();
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Неверный формат community_id"));
            }

            System.out.println("User " + userId + " joining community " + communityId);

            // Проверяем, не состоит ли уже
            if (memberCommunityRepository.existsByUserIdAndCommunityId(userId, communityId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Уже в сообществе"));
            }

            MemberCommunity member = new MemberCommunity();
            member.setUserId(userId);
            member.setCommunityId(communityId);
            member.setDateJoining(LocalDate.now());
            member.setRoleId(1); // Обычный участник

            memberCommunityRepository.save(member);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Успешно вступили");
            response.put("community_id", communityId);
            response.put("user_id", userId);

            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Неверный формат числа: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(Map.of("error", "Не авторизован: " + e.getMessage()));
        }
    }

    // Покинуть сообщество
    @DeleteMapping("/{communityId}")
    public ResponseEntity<?> leaveCommunity(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer communityId) {
        try {
            System.out.println("Leaving community: " + communityId);

            String cleanToken = token.replace("Bearer ", "");
            String uid = firebaseService.verifyToken(cleanToken);

            Integer userId = userService.getUserIdByFirebaseUid(uid);
            if (userId == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Пользователь не найден"));
            }

            memberCommunityRepository.deleteByUserIdAndCommunityId(userId, communityId);

            return ResponseEntity.ok(Map.of("message", "Покинули сообщество"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(Map.of("error", "Не авторизован"));
        }
    }
}