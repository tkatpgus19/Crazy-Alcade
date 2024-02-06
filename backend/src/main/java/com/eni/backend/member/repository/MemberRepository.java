package com.eni.backend.member.repository;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByProviderAndSocialId(OAuth2Provider provider, String socialId);
    Optional<Member> findById(Long memberId);
}
