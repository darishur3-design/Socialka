package ru.nngasu.socialka.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nngasu.socialka.model.EventTimeline;
import java.util.List;

public interface EventTimelineRepository extends JpaRepository<EventTimeline, Integer> {
    List<EventTimeline> findByEventId(Integer eventId);
}