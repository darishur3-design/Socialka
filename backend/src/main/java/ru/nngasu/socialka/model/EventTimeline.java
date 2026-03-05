package ru.nngasu.socialka.model;

import jakarta.persistence.*;

@Entity
@Table(name = "event_timeline")
public class EventTimeline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "time_range")
    private String timeRange;

    private String place;
    private String description;

    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "user_id")
    private Integer userId;

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTimeRange() { return timeRange; }
    public void setTimeRange(String timeRange) { this.timeRange = timeRange; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}