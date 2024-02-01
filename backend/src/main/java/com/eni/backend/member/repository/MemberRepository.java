package com.eni.backend.member.repository;

import com.eni.backend.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Member save(Member member);
    boolean existsMemberByEmail(String email);
    Optional<Member> findByEmail(String email);
}
