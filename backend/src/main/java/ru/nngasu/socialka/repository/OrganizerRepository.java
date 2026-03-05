package ru.nngasu.socialka.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nngasu.socialka.model.Organizer;
import java.util.List;

public interface OrganizerRepository extends JpaRepository<Organizer, Integer> {
    List<Organizer> findByEventId(Integer eventId);
}