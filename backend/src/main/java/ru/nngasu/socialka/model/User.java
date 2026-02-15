package ru.nngasu.socialka.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String authUid;
    private String email;
    private String firstName;
    @Column(nullable = true)
    private String lastName;
    @Column(name = "date_birth")
    private LocalDate dateBirth;

    public LocalDate getDateBirth() {
        return dateBirth;
    }

    public void setDateBirth(LocalDate dateBirth) {
        this.dateBirth = dateBirth;
    }
    // ===== getters =====

    public Long getId() {
        return id;
    }

    public String getAuthUid() {
        return authUid;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    // ===== setters =====

    public void setId(Long id) {
        this.id = id;
    }

    public void setAuthUid(String authUid) {
        this.authUid = authUid;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
