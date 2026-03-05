package ru.nngasu.socialka.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nngasu.socialka.model.EventPrintMaterials;
import java.util.List;

public interface EventPrintMaterialsRepository extends JpaRepository<EventPrintMaterials, Integer> {
    List<EventPrintMaterials> findByEventId(Integer eventId);
}