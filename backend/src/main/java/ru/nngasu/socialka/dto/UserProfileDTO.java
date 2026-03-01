package ru.nngasu.socialka.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class UserProfileDTO {
    private Long id;
    private String authUid;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDate dateBirth;
    private String role;
    private String position;
    private String group;
    private Integer hours;
    private Integer rating;
    private List<Map<String, Object>> communities;
    private List<Map<String, Object>> events;
    private List<Map<String, Object>> organizerEvents;

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAuthUid() { return authUid; }
    public void setAuthUid(String authUid) { this.authUid = authUid; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getDateBirth() { return dateBirth; }
    public void setDateBirth(LocalDate dateBirth) { this.dateBirth = dateBirth; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getGroup() { return group; }
    public void setGroup(String group) { this.group = group; }

    public Integer getHours() { return hours; }
    public void setHours(Integer hours) { this.hours = hours; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public List<Map<String, Object>> getCommunities() { return communities; }
    public void setCommunities(List<Map<String, Object>> communities) { this.communities = communities; }

    public List<Map<String, Object>> getEvents() { return events; }
    public void setEvents(List<Map<String, Object>> events) { this.events = events; }

    public List<Map<String, Object>> getOrganizerEvents() { return organizerEvents; }
    public void setOrganizerEvents(List<Map<String, Object>> organizerEvents) { this.organizerEvents = organizerEvents; }
}