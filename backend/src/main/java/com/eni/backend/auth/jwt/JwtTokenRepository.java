package com.eni.backend.auth.jwt;

import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JwtTokenRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByProviderAndSocialId(OAuth2Provider provider, String socialId);
    Optional<Member> findById(Long memberId);

}

