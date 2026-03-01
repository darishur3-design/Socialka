package ru.nngasu.socialka.service;

import org.springframework.stereotype.Service;
import ru.nngasu.socialka.model.Community;
import ru.nngasu.socialka.repository.CommunityRepository;
import ru.nngasu.socialka.repository.MemberCommunityRepository;
import ru.nngasu.socialka.repository.EventRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final MemberCommunityRepository memberRepository;
    private final EventRepository eventRepository;

    public CommunityService(CommunityRepository communityRepository,
                            MemberCommunityRepository memberRepository,
                            EventRepository eventRepository) {
        this.communityRepository = communityRepository;
        this.memberRepository = memberRepository;
        this.eventRepository = eventRepository;
    }

    public List<Map<String, Object>> getAllCommunities() {
        List<Object[]> results = communityRepository.findAllWithStats();

        return results.stream().map(obj -> {
            Community c = (Community) obj[0];
            Long membersCount = (Long) obj[1];
            Long eventsCount = (Long) obj[2];

            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            map.put("thematics", c.getThematics());
            map.put("description", c.getDescription());
            map.put("logo", c.getLogo());
            map.put("creationYear", c.getCreationYear());
            map.put("membersCount", membersCount != null ? membersCount : 0);
            map.put("eventsCount", eventsCount != null ? eventsCount : 0);
            map.put("iconClass", getIconClass(c.getThematics()));
            map.put("iconName", getIconName(c.getThematics()));

            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getCommunityById(Integer id) {
        Optional<Community> optional = communityRepository.findById(id);
        if (optional.isEmpty()) {
            return null;
        }

        Community c = optional.get();

        // Подсчет участников
        long membersCount = memberRepository.findByCommunityId(c.getId()).size();

        // Подсчет мероприятий
        long eventsCount = eventRepository.countByCommunityId(c.getId());

        Map<String, Object> map = new HashMap<>();
        map.put("id", c.getId());
        map.put("name", c.getName());
        map.put("thematics", c.getThematics());
        map.put("description", c.getDescription());
        map.put("logo", c.getLogo());
        map.put("creationYear", c.getCreationYear());
        map.put("membersCount", membersCount);
        map.put("eventsCount", eventsCount);
        map.put("iconClass", getIconClass(c.getThematics()));
        map.put("iconName", getIconName(c.getThematics()));

        return map;
    }

    private String getIconClass(String thematics) {
        if (thematics == null) return "volunteer";
        String lower = thematics.toLowerCase();
        if (lower.contains("волонт") || lower.contains("социальн")) return "volunteer";
        if (lower.contains("медиа") || lower.contains("фото")) return "media";
        if (lower.contains("наук") || lower.contains("исслед")) return "science";
        if (lower.contains("спорт")) return "sport";
        if (lower.contains("творч") || lower.contains("культур")) return "culture";
        return "volunteer";
    }

    private String getIconName(String thematics) {
        if (thematics == null) return "fas fa-users";
        String lower = thematics.toLowerCase();
        if (lower.contains("волонт") || lower.contains("социальн")) return "fas fa-hand-holding-heart";
        if (lower.contains("медиа") || lower.contains("фото")) return "fas fa-camera";
        if (lower.contains("наук") || lower.contains("исслед")) return "fas fa-flask";
        if (lower.contains("спорт")) return "fas fa-futbol";
        if (lower.contains("творч") || lower.contains("культур")) return "fas fa-paint-brush";
        return "fas fa-users";
    }
}