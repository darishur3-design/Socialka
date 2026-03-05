package ru.nngasu.socialka.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nngasu.socialka.model.EventMto;
import java.util.List;

public interface EventMtoRepository extends JpaRepository<EventMto, Integer> {
    List<EventMto> findByEventId(Integer eventId);
}