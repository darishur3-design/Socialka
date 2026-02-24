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

    // ===== ГЕТТЕРЫ =====
    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getPlace() {
        return place;
    }

    public Integer getFormatId() {
        return formatId;
    }

    public Integer getCommunityId() {
        return communityId;
    }

    public Integer getStatus() {
        return status;
    }

    public String getQrToken() {
        return qrToken;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ===== СЕТТЕРЫ =====
    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public void setFormatId(Integer formatId) {
        this.formatId = formatId;
    }

    public void setCommunityId(Integer communityId) {
        this.communityId = communityId;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}