package ru.nngasu.socialka.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.nngasu.socialka.model.EventPassport;
import java.util.List;

public interface EventRepository extends JpaRepository<EventPassport, Integer> {

    @Query("SELECT e, f.name as formatName, c.name as communityName " +
            "FROM EventPassport e " +
            "LEFT JOIN Format f ON e.formatId = f.id " +
            "LEFT JOIN Community c ON e.communityId = c.id")
    List<Object[]> findAllWithDetails();

    long countByCommunityId(Integer communityId);
}