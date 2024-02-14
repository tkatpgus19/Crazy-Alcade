package com.eni.backend.room.repository;

import com.eni.backend.room.entity.PlayMode;
import com.eni.backend.room.entity.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RankingRepository extends JpaRepository<Ranking, Long> {

    Optional<Ranking> findByPlayModeAndValue(PlayMode playMode, Integer value);

}
