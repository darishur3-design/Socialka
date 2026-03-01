package ru.nngasu.socialka.service;

import org.springframework.stereotype.Service;
import ru.nngasu.socialka.model.EventPassport;
import ru.nngasu.socialka.model.Community;
import ru.nngasu.socialka.model.Format;
import ru.nngasu.socialka.repository.EventRepository;
import ru.nngasu.socialka.repository.CommunityRepository;
import ru.nngasu.socialka.repository.FormatRepository;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final CommunityRepository communityRepository;
    private final FormatRepository formatRepository;

    public EventService(EventRepository eventRepository,
                        CommunityRepository communityRepository,
                        FormatRepository formatRepository) {
        this.eventRepository = eventRepository;
        this.communityRepository = communityRepository;
        this.formatRepository = formatRepository;
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
            map.put("community_id", e.getCommunityId());
            map.put("format_id", e.getFormatId());
            map.put("organizers", communityName != null ? communityName : "Неизвестно");

            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getEventById(Integer id) {
        Optional<EventPassport> optional = eventRepository.findById(id);
        if (optional.isEmpty()) {
            return null;
        }

        EventPassport e = optional.get();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        // Получаем название формата как финальную переменную
        final String formatName;
        if (e.getFormatId() != null) {
            Optional<Format> formatOpt = formatRepository.findById(e.getFormatId());
            formatName = formatOpt.map(Format::getName).orElse("Неизвестно");
        } else {
            formatName = "Неизвестно";
        }

        // Получаем название сообщества как финальную переменную
        final String communityName;
        if (e.getCommunityId() != null) {
            Optional<Community> communityOpt = communityRepository.findById(e.getCommunityId());
            communityName = communityOpt.map(Community::getName).orElse("Неизвестно");
        } else {
            communityName = "Неизвестно";
        }

        Map<String, Object> map = new HashMap<>();
        map.put("id", e.getId());
        map.put("title", e.getName());
        map.put("description", e.getDescription());
        map.put("date", e.getDate().format(formatter));
        map.put("time", "10:00");
        map.put("format", formatName);
        map.put("location", e.getPlace());
        map.put("community", communityName);
        map.put("community_id", e.getCommunityId());
        map.put("format_id", e.getFormatId());
        map.put("organizers", communityName);

        return map;
    }
}