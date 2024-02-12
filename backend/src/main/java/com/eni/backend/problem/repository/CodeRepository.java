package com.eni.backend.problem.repository;

import com.eni.backend.member.entity.Member;
import com.eni.backend.problem.entity.Code;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CodeRepository extends JpaRepository<Code, Long> {

    List<Code> findAllByMember(Member member);
}
