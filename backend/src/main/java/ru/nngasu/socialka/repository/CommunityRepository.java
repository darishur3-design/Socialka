package ru.nngasu.socialka.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.nngasu.socialka.model.Community;
import java.util.List;

public interface CommunityRepository extends JpaRepository<Community, Integer> {

    @Query("SELECT c, " +
            "COUNT(DISTINCT mc.userId) as membersCount, " +
            "COUNT(DISTINCT e.id) as eventsCount " +
            "FROM Community c " +
            "LEFT JOIN MemberCommunity mc ON c.id = mc.communityId " +
            "LEFT JOIN EventPassport e ON c.id = e.communityId " +
            "GROUP BY c.id")
    List<Object[]> findAllWithStats();
}