package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.EventBudget;
import ru.nngasu.socialka.repository.EventBudgetRepository;

import java.util.List;

@RestController
@RequestMapping("/api/event_budget")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class EventBudgetController {

    private final EventBudgetRepository eventBudgetRepository;

    public EventBudgetController(EventBudgetRepository eventBudgetRepository) {
        this.eventBudgetRepository = eventBudgetRepository;
    }

    @GetMapping
    public ResponseEntity<List<EventBudget>> getByEventId(@RequestParam Integer event_id) {
        return ResponseEntity.ok(eventBudgetRepository.findByEventId(event_id));
    }

    @PostMapping
    public ResponseEntity<EventBudget> create(@RequestBody EventBudget budget) {
        return ResponseEntity.ok(eventBudgetRepository.save(budget));
    }
}