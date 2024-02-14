package com.eni.backend.problem.repository;

import com.eni.backend.member.entity.Member;
import com.eni.backend.problem.entity.Code;
import com.eni.backend.problem.entity.CodeStatus;
import com.eni.backend.problem.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface CodeRepository extends JpaRepository<Code, Long> {
    @Query("select DISTINCT(c.problem) from Code c where c.member = :member order by c.problem.no")
    List<Problem> findAllByMember(@Param("member") Member member);

    @Query("select DISTINCT(c.problem) from Code c where c.member = :member and c.status = :codeStatus order by c.problem.no")
    List<Problem> findAllByMemberAndCodeStatus(@Param("member") Member member, @Param("codeStatus") CodeStatus codeStatus);
}
