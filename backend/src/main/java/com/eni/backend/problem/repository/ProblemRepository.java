package com.eni.backend.problem.repository;

import com.eni.backend.common.entity.ProblemPlatform;
import com.eni.backend.problem.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    boolean existsByPlatformAndNo(ProblemPlatform platform, Integer no);

}
