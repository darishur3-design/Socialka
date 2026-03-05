package ru.nngasu.socialka.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nngasu.socialka.model.EventBudget;
import java.util.List;

public interface EventBudgetRepository extends JpaRepository<EventBudget, Integer> {
    List<EventBudget> findByEventId(Integer eventId);
}