package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.Organizer;
import ru.nngasu.socialka.repository.OrganizerRepository;

import java.util.List;

@RestController
@RequestMapping("/api/organizers")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class OrganizerController {

    private final OrganizerRepository organizerRepository;

    public OrganizerController(OrganizerRepository organizerRepository) {
        this.organizerRepository = organizerRepository;
    }

    @GetMapping
    public ResponseEntity<List<Organizer>> getByEventId(@RequestParam Integer event_id) {
        return ResponseEntity.ok(organizerRepository.findByEventId(event_id));
    }

    @PostMapping
    public ResponseEntity<Organizer> create(@RequestBody Organizer organizer) {
        return ResponseEntity.ok(organizerRepository.save(organizer));
    }
}