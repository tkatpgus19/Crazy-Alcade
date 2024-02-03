package com.eni.backend.problem.repository;

import com.eni.backend.problem.entity.Testcase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestcaseRepository extends JpaRepository<Testcase, Long> {

    List<Testcase> findAllByProblemIdAndIsHidden(Long problemId, boolean isHidden);
    List<Testcase> findAllByProblemId(Long problemId);

}
