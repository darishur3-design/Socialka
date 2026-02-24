package ru.nngasu.socialka.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "members_communities")
public class MemberCommunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "community_id")
    private Integer communityId;

    @Column(name = "date_joining")
    private LocalDate dateJoining;

    @Column(name = "role_id")
    private Integer roleId;

    // ===== ГЕТТЕРЫ =====
    public Integer getId() {
        return id;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getCommunityId() {
        return communityId;
    }

    public LocalDate getDateJoining() {
        return dateJoining;
    }

    public Integer getRoleId() {
        return roleId;
    }

    // ===== СЕТТЕРЫ =====
    public void setId(Integer id) {
        this.id = id;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setCommunityId(Integer communityId) {
        this.communityId = communityId;
    }

    public void setDateJoining(LocalDate dateJoining) {
        this.dateJoining = dateJoining;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
}