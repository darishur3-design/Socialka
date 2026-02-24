package ru.nngasu.socialka.model;

import jakarta.persistence.*;

@Entity
@Table(name = "formats")
public class Format {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    // ===== ГЕТТЕРЫ =====
    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    // ===== СЕТТЕРЫ =====
    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}