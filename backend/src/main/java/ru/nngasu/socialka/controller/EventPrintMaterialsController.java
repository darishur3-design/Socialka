package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.EventPrintMaterials;
import ru.nngasu.socialka.repository.EventPrintMaterialsRepository;

import java.util.List;

@RestController
@RequestMapping("/api/event_print_materials")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class EventPrintMaterialsController {

    private final EventPrintMaterialsRepository eventPrintMaterialsRepository;

    public EventPrintMaterialsController(EventPrintMaterialsRepository eventPrintMaterialsRepository) {
        this.eventPrintMaterialsRepository = eventPrintMaterialsRepository;
    }

    @GetMapping
    public ResponseEntity<List<EventPrintMaterials>> getByEventId(@RequestParam Integer event_id) {
        return ResponseEntity.ok(eventPrintMaterialsRepository.findByEventId(event_id));
    }

    @PostMapping
    public ResponseEntity<EventPrintMaterials> create(@RequestBody EventPrintMaterials print) {
        return ResponseEntity.ok(eventPrintMaterialsRepository.save(print));
    }
}