package ru.nngasu.socialka.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.nngasu.socialka.model.EventPassport;
import ru.nngasu.socialka.repository.EventRepository;
import ru.nngasu.socialka.service.EventService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class EventController {

    private final EventService eventService;
    private final EventRepository eventRepository;

    public EventController(EventService eventService, EventRepository eventRepository) {
        this.eventService = eventService;
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getEventById(@PathVariable Integer id) {
        Map<String, Object> event = eventService.getEventById(id);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(event);
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("Создание мероприятия: " + payload);

            EventPassport event = new EventPassport();
            event.setName((String) payload.get("name"));
            event.setDescription((String) payload.get("description"));

            String dateStr = (String) payload.get("date");
            if (dateStr != null) {
                event.setDate(LocalDate.parse(dateStr));
            }

            event.setPlace((String) payload.get("place"));

            Object formatId = payload.get("format_id");
            if (formatId != null) {
                event.setFormatId(Integer.parseInt(formatId.toString()));
            }

            Object communityId = payload.get("community_id");
            if (communityId != null) {
                event.setCommunityId(Integer.parseInt(communityId.toString()));
            }

            // responsible - ID из members_communities (число)
            Object responsible = payload.get("responsible");
            if (responsible != null) {
                event.setResponsible(Integer.parseInt(responsible.toString()));
            }

            // responsible_phone - текст
            event.setResponsiblePhone((String) payload.get("responsible_phone"));

            // community_leader - текст (имя руководителя)
            event.setCommunityLeader((String) payload.get("community_leader"));

            event.setSmartGoal((String) payload.get("smart_goal"));

            Object directionId = payload.get("direction_id");
            if (directionId != null) {
                event.setDirectionId(Integer.parseInt(directionId.toString()));
            }

            event.setTargetAudience((String) payload.get("target_audience"));
            event.setQuantitative((String) payload.get("quantitative"));
            event.setQualitative((String) payload.get("qualitative"));

            // Обязательные поля из БД
            event.setEventLevel(1); // Обычное мероприятие (из таблицы event_levels)
            event.setCommunityRoleId(1); // Организатор (из таблицы community_roles)
            event.setStatus(1); // Отправлено (из таблицы events_status)

            event.setCreatedAt(LocalDateTime.now());

            EventPassport saved = eventRepository.save(event);

            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("message", "Мероприятие создано");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateEventStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> body) {
        try {
            System.out.println("Updating status for event " + id + " to " + body.get("status"));

            Integer status = body.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }

            // Обновляем только статус через специальный метод
            int updated = eventRepository.updateStatus(id, status);

            if (updated == 0) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Статус обновлен");
            response.put("id", id);
            response.put("status", status);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}