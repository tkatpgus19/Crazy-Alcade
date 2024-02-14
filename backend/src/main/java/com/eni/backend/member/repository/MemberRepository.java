package com.eni.backend.member.repository;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findById(Long memberId);

    Optional<Member> findByNickname(String nickname);

    Optional<Member> findBySocialIdAndProvider(String socialId, OAuth2Provider provider);
}
