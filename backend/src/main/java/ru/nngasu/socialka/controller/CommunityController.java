package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.service.CommunityService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/communities")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class CommunityController {

    private final CommunityService communityService;

    // ЭТОТ КОНСТРУКТОР ДОЛЖЕН БЫТЬ
    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCommunityById(@PathVariable Integer id) {
        Map<String, Object> community = communityService.getCommunityById(id);
        if (community == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(community);
    }
}