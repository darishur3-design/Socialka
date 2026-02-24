package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.User;
import ru.nngasu.socialka.repository.UserRepository;
import ru.nngasu.socialka.service.FirebaseService;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class UserController {

    private final FirebaseService firebaseService;
    private final UserRepository userRepository;

    public UserController(FirebaseService firebaseService,
                          UserRepository userRepository) {
        this.firebaseService = firebaseService;
        this.userRepository = userRepository;
    }

    // регистрация пользователя в PostgreSQL
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestHeader("Authorization") String token,
            @RequestBody User userData
    ) throws Exception {

        String cleanToken = token.replace("Bearer ", "");
        String uid = firebaseService.verifyToken(cleanToken);

        if (userRepository.findByAuthUid(uid).isPresent()) {
            return ResponseEntity.ok("exists");
        }

        User user = new User();
        user.setAuthUid(uid);
        user.setEmail(userData.getEmail());
        user.setFirstName(userData.getFirstName());
        user.setLastName(userData.getLastName());
        user.setDateBirth(userData.getDateBirth());

        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    // ПОЛУЧЕНИЕ ПРОФИЛЯ ПО FIREBASE UID
    @GetMapping("/{uid}")
    public ResponseEntity<?> getUser(@PathVariable String uid) {

        Optional<User> user = userRepository.findByAuthUid(uid);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user.get());
    }

    // УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ ПО UID
    @DeleteMapping("/delete/{uid}")
    public ResponseEntity<?> deleteUser(@PathVariable String uid) {

        Optional<User> user = userRepository.findByAuthUid(uid);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userRepository.delete(user.get());

        return ResponseEntity.ok("deleted");
    }

    // УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ ПО AUTH_UID (альтернативный метод)
    @PostMapping("/delete-by-uid")
    public ResponseEntity<?> deleteByUid(@RequestBody Map<String, String> body) {
        String uid = body.get("authUid");
        userRepository.deleteByAuthUid(uid);
        return ResponseEntity.ok().build();
    }
}