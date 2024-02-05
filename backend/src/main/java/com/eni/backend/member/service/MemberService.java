package com.eni.backend.member.service;

import com.eni.backend.auth.jwt.JwtTokenProvider;
import com.eni.backend.auth.oauth2.service.OAuth2UserPrincipal;
import com.eni.backend.auth.oauth2.user.OAuth2UserInfo;
import com.eni.backend.member.dto.response.LoginResponseDto;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // true: 신규 회원, false: 기존 회원
    private boolean isNew = true;

    // true: 로그인 보상 O, false: 로그인 보상 X
    private boolean isConnected = true;

    public LoginResponseDto login(Authentication authentication) {
        OAuth2UserPrincipal principal = getOAuth2UserPrincipal(authentication);

        Member member = findMemberBySocial(principal.getUserInfo());
        String accessToken = jwtTokenProvider.generateAccessToken(authentication, member.getId());

        //로그인 할 때 최종 접속시간 확인해서 로그인 보상 받을 수 있는지 확인
        if(isNew) {
            isConnected = true;
        }
        else {
            isConnected = !Objects.equals(member.getConnectedAt().toLocalDateTime().toLocalDate(), LocalDate.now());
        }

        return LoginResponseDto.of(member.getId(), accessToken, isNew, isConnected);
    }

    @Transactional
    public Member findMemberBySocial(OAuth2UserInfo info) {

        // DB -> 회원 정보 있는지 확인
        Optional<Member> findMember = memberRepository.findByProviderAndSocialId(
                info.getProvider(), info.getId());

        // 회원 정보가 있으면 해당 회원 리턴
        if (findMember.isPresent()) {
            Member member = findMember.get();
            member.updateConnectedAt(Timestamp.valueOf(LocalDateTime.now()));
            isNew = false;
            return member;
        }
        // 없으면 새로 생성해서 리턴
        else {
            isNew = true;
            return memberRepository.save(Member.from(info));
        }
    }

    public Member validateMemberByToken(Long memberId) {
        return findMemberById(memberId)
                .orElseThrow(IllegalArgumentException::new);
    }

    private Optional<Member> findMemberById(Long memberId) {
        return memberRepository.findById(memberId);
    }

    private OAuth2UserPrincipal getOAuth2UserPrincipal(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2UserPrincipal) {
            return (OAuth2UserPrincipal) principal;
        }
        return null;
    }
}