package ru.nngasu.socialka.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "events_passports")
public class EventPassport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String place;

    @Column(name = "format_id")
    private Integer formatId;

    @Column(name = "community_id")
    private Integer communityId;

    private Integer status;

    @Column(name = "qr_token")
    private String qrToken;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // === ПОЛЯ ИЗ БД ===
    @Column(name = "event_level")
    private Integer eventLevel;           // уровень мероприятия

    @Column(name = "community_role_id")
    private Integer communityRoleId;      // роль сообщества

    private Integer responsible;          // ID ответственного (из members_communities)

    @Column(name = "responsible_phone")
    private String responsiblePhone;      // телефон ответственного

    @Column(name = "community_leader")
    private String communityLeader;       // руководитель сообщества (текст!)

    @Column(name = "smart_goal")
    private String smartGoal;             // цель по SMART

    @Column(name = "direction_id")
    private Integer directionId;          // ID направления

    @Column(name = "target_audience")
    private String targetAudience;        // целевая аудитория

    private String quantitative;          // количественные показатели
    private String qualitative;           // качественные показатели

    // ===== ГЕТТЕРЫ =====
    public Integer getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public LocalDate getDate() { return date; }
    public String getPlace() { return place; }
    public Integer getFormatId() { return formatId; }
    public Integer getCommunityId() { return communityId; }
    public Integer getStatus() { return status; }
    public String getQrToken() { return qrToken; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public Integer getEventLevel() { return eventLevel; }
    public Integer getCommunityRoleId() { return communityRoleId; }
    public Integer getResponsible() { return responsible; }
    public String getResponsiblePhone() { return responsiblePhone; }
    public String getCommunityLeader() { return communityLeader; }
    public String getSmartGoal() { return smartGoal; }
    public Integer getDirectionId() { return directionId; }
    public String getTargetAudience() { return targetAudience; }
    public String getQuantitative() { return quantitative; }
    public String getQualitative() { return qualitative; }

    // ===== СЕТТЕРЫ =====
    public void setId(Integer id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setPlace(String place) { this.place = place; }
    public void setFormatId(Integer formatId) { this.formatId = formatId; }
    public void setCommunityId(Integer communityId) { this.communityId = communityId; }
    public void setStatus(Integer status) { this.status = status; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setEventLevel(Integer eventLevel) { this.eventLevel = eventLevel; }
    public void setCommunityRoleId(Integer communityRoleId) { this.communityRoleId = communityRoleId; }
    public void setResponsible(Integer responsible) { this.responsible = responsible; }
    public void setResponsiblePhone(String responsiblePhone) { this.responsiblePhone = responsiblePhone; }
    public void setCommunityLeader(String communityLeader) { this.communityLeader = communityLeader; }
    public void setSmartGoal(String smartGoal) { this.smartGoal = smartGoal; }
    public void setDirectionId(Integer directionId) { this.directionId = directionId; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    public void setQuantitative(String quantitative) { this.quantitative = quantitative; }
    public void setQualitative(String qualitative) { this.qualitative = qualitative; }
}