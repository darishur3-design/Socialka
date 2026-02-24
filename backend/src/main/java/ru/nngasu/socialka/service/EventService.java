package ru.nngasu.socialka.service;

import org.springframework.stereotype.Service;
import ru.nngasu.socialka.model.EventPassport;
import ru.nngasu.socialka.repository.EventRepository;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    // ДОБАВЬ ЭТОТ КОНСТРУКТОР
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Map<String, Object>> getAllEvents() {
        List<Object[]> results = eventRepository.findAllWithDetails();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        return results.stream().map(obj -> {
            EventPassport e = (EventPassport) obj[0];
            String formatName = (String) obj[1];
            String communityName = (String) obj[2];

            Map<String, Object> map = new HashMap<>();
            map.put("id", e.getId());
            map.put("title", e.getName());
            map.put("description", e.getDescription());
            map.put("date", e.getDate().format(formatter));
            map.put("time", "10:00");
            map.put("format", formatName != null ? formatName : "Неизвестно");
            map.put("location", e.getPlace());
            map.put("community", communityName != null ? communityName : "Неизвестно");

            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getEventById(Integer id) {
        // TODO: реализовать получение одного мероприятия
        return null;
    }
}