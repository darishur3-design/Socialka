package ru.nngasu.socialka.service;

import org.springframework.stereotype.Service;
import ru.nngasu.socialka.dto.UserProfileDTO;
import ru.nngasu.socialka.model.User;
import ru.nngasu.socialka.model.MemberCommunity;
import ru.nngasu.socialka.model.EventPassport;
import ru.nngasu.socialka.repository.UserRepository;
import ru.nngasu.socialka.repository.MemberCommunityRepository;
import ru.nngasu.socialka.repository.EventRepository;
import ru.nngasu.socialka.repository.CommunityRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MemberCommunityRepository memberCommunityRepository;
    private final EventRepository eventRepository;
    private final CommunityRepository communityRepository;

    public UserService(UserRepository userRepository,
                       MemberCommunityRepository memberCommunityRepository,
                       EventRepository eventRepository,
                       CommunityRepository communityRepository) {
        this.userRepository = userRepository;
        this.memberCommunityRepository = memberCommunityRepository;
        this.eventRepository = eventRepository;
        this.communityRepository = communityRepository;
    }

    public Integer getUserIdByFirebaseUid(String firebaseUid) {
        Optional<User> user = userRepository.findByAuthUid(firebaseUid);
        return user.map(u -> u.getId().intValue()).orElse(null);
    }

    public Optional<User> getUserByFirebaseUid(String firebaseUid) {
        return userRepository.findByAuthUid(firebaseUid);
    }

    public UserProfileDTO getUserProfile(String firebaseUid) {
        Optional<User> userOpt = userRepository.findByAuthUid(firebaseUid);
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        UserProfileDTO dto = new UserProfileDTO();

        // Основные данные
        dto.setId(user.getId());
        dto.setAuthUid(user.getAuthUid());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setDateBirth(user.getDateBirth());

        // Роль (пока заглушка)
        dto.setRole("Базовый пользователь");
        dto.setPosition("—");
        dto.setGroup("—");

        // Статистика (пока заглушки)
        dto.setHours(0);
        dto.setRating(0);

        // Сообщества пользователя
        List<MemberCommunity> memberships = memberCommunityRepository.findByUserId(user.getId().intValue());
        List<Map<String, Object>> communities = memberships.stream()
                .map(mc -> {
                    Map<String, Object> commMap = new HashMap<>();
                    commMap.put("id", mc.getCommunityId());
                    communityRepository.findById(mc.getCommunityId()).ifPresent(c -> {
                        commMap.put("name", c.getName());
                    });
                    return commMap;
                })
                .filter(m -> m.containsKey("name"))
                .collect(Collectors.toList());
        dto.setCommunities(communities);

        // Мероприятия, где пользователь участник
        List<Map<String, Object>> events = new ArrayList<>();
        // TODO: добавить запрос мероприятий пользователя
        dto.setEvents(events);

        // Мероприятия, где пользователь организатор
        List<Map<String, Object>> organizerEvents = new ArrayList<>();
        // TODO: добавить запрос мероприятий, где пользователь организатор
        dto.setOrganizerEvents(organizerEvents);

        return dto;
    }
}