package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.EventMto;
import ru.nngasu.socialka.repository.EventMtoRepository;

import java.util.List;

@RestController
@RequestMapping("/api/event_mto")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class EventMtoController {

    private final EventMtoRepository eventMtoRepository;

    public EventMtoController(EventMtoRepository eventMtoRepository) {
        this.eventMtoRepository = eventMtoRepository;
    }

    @GetMapping
    public ResponseEntity<List<EventMto>> getByEventId(@RequestParam Integer event_id) {
        return ResponseEntity.ok(eventMtoRepository.findByEventId(event_id));
    }

    @PostMapping
    public ResponseEntity<EventMto> create(@RequestBody EventMto mto) {
        return ResponseEntity.ok(eventMtoRepository.save(mto));
    }
}