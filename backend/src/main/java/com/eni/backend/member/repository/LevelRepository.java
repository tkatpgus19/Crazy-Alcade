package com.eni.backend.member.repository;

import com.eni.backend.member.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LevelRepository extends JpaRepository<Level, Integer> {

    boolean existsLevelById(Integer level);
    Optional<Level> findLevelById(Integer level);
}

