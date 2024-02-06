package com.eni.backend.member.service;

import com.eni.backend.auth.jwt.JwtTokenProvider;
import com.eni.backend.auth.oauth2.service.OAuth2UserPrincipal;
import com.eni.backend.auth.oauth2.user.OAuth2UserInfo;
import com.eni.backend.member.dto.response.LoginResponse;
import com.eni.backend.member.entity.Level;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.repository.LevelRepository;
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
    private final LevelRepository levelRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // true: 신규 회원, false: 기존 회원
    private boolean isNew = true;

    // true: 로그인 보상 O, false: 로그인 보상 X
    private boolean isConnected = true;

    public LoginResponse login(Authentication authentication) {
        OAuth2UserPrincipal principal = getOAuth2UserPrincipal(authentication);

        Member member = findMemberBySocial(principal.getUserInfo());
        String accessToken = jwtTokenProvider.generateAccessToken(authentication, member.getId());

        //로그인 할 때 최종 접속시간 확인해서 로그인 보상 받을 수 있는지 확인
        if(isNew) {
            // 신규회원
            // 로그인 보상
            isConnected = true;
        }
        else {
            // 기존회원
            // 최종 접속일 확인 후 로그인 보상
            isConnected = !Objects.equals(member.getConnectedAt().toLocalDateTime().toLocalDate(), LocalDate.now());
        }

        return LoginResponse.of(member.getId(), accessToken, isNew, isConnected);
    }

    @Transactional
    public Member findMemberBySocial(OAuth2UserInfo info) {

        // DB에서 회원 정보 있는지 확인
        Optional<Member> findMember = memberRepository.findByProviderAndSocialId(
                info.getProvider(), info.getId());

        Member member;

        // 회원 정보가 있으면 해당 회원 리턴
        if (findMember.isPresent()) {
            isNew = false;
            member = findMember.get();

            // 회원 탐색할 때 최종 접속시간 갱신
            member.updateConnectedAt(Timestamp.valueOf(LocalDateTime.now()));

            return member;
        }
        // 없으면 새로 생성해서 리턴
        else {
            isNew = true;
            member = Member.from(info);

            //레벨을 기본값을 1로 설정
            Optional<Level> defaultLevel = levelRepository.findById(1);
            defaultLevel.ifPresent(member::updateDefaultLevel);

            return memberRepository.save(member);
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