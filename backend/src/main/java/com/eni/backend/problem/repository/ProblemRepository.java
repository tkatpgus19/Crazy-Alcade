package com.eni.backend.problem.repository;

import com.eni.backend.problem.entity.ProblemPlatform;
import com.eni.backend.problem.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    boolean existsByPlatformAndNo(ProblemPlatform platform, Integer no);
    List<Problem> findAllByTierId(Long tierId);
    Optional<Problem> findById(Long problemId);

}
