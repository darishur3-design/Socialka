package ru.nngasu.socialka.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.nngasu.socialka.model.MemberCommunity;
import java.util.List;

public interface MemberCommunityRepository extends JpaRepository<MemberCommunity, Integer> {

    List<MemberCommunity> findByUserId(Integer userId);

    List<MemberCommunity> findByCommunityId(Integer communityId);

    @Query("SELECT mc.communityId FROM MemberCommunity mc WHERE mc.userId = :userId")
    List<Integer> findCommunityIdsByUserId(Integer userId);

    @Modifying
    @Query("DELETE FROM MemberCommunity mc WHERE mc.userId = :userId AND mc.communityId = :communityId")
    void deleteByUserIdAndCommunityId(Integer userId, Integer communityId);

    boolean existsByUserIdAndCommunityId(Integer userId, Integer communityId);
}