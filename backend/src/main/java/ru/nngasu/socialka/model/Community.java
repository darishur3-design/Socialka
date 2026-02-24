package ru.nngasu.socialka.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "communities")
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String thematics;

    @Column(nullable = false, length = 1000)
    private String description;

    private String logo;

    @Column(name = "creation_year")
    private Short creationYear;

    // ===== ГЕТТЕРЫ =====
    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getThematics() {
        return thematics;
    }

    public String getDescription() {
        return description;
    }

    public String getLogo() {
        return logo;
    }

    public Short getCreationYear() {
        return creationYear;
    }

    // ===== СЕТТЕРЫ =====
    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setThematics(String thematics) {
        this.thematics = thematics;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public void setCreationYear(Short creationYear) {
        this.creationYear = creationYear;
    }
}