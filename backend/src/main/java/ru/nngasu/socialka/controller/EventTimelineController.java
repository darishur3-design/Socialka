package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.EventTimeline;
import ru.nngasu.socialka.repository.EventTimelineRepository;

import java.util.List;

@RestController
@RequestMapping("/api/event_timeline")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class EventTimelineController {

    private final EventTimelineRepository eventTimelineRepository;

    public EventTimelineController(EventTimelineRepository eventTimelineRepository) {
        this.eventTimelineRepository = eventTimelineRepository;
    }

    @GetMapping
    public ResponseEntity<List<EventTimeline>> getByEventId(@RequestParam Integer event_id) {
        return ResponseEntity.ok(eventTimelineRepository.findByEventId(event_id));
    }

    @PostMapping
    public ResponseEntity<EventTimeline> create(@RequestBody EventTimeline timeline) {
        return ResponseEntity.ok(eventTimelineRepository.save(timeline));
    }
}