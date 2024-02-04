package com.eni.backend.member.service;

import com.eni.backend.auth.jwt.JwtTokenProvider;
import com.eni.backend.auth.oauth2.service.OAuth2UserPrincipal;
import com.eni.backend.auth.oauth2.user.OAuth2UserInfo;
import com.eni.backend.common.entity.Language;
import com.eni.backend.member.dto.request.MemberRequestDto;
import com.eni.backend.member.dto.response.LoginResponseDto;
import com.eni.backend.member.entity.Member;
import com.eni.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponseDto login(Authentication authentication) {
        OAuth2UserPrincipal principal = getOAuth2UserPrincipal(authentication);

        Member member = findMemberBySocial(principal.getUserInfo());
        String accessToken = jwtTokenProvider.generateAccessToken(authentication, member.getId());

        return LoginResponseDto.of(member.getId(), accessToken);
    }

    @Transactional
    public Member findMemberBySocial(OAuth2UserInfo info) {
        // DB -> 회원 정보 있는지 확인
        Optional<Member> findMember = memberRepository.findByProviderAndSocialId(
                info.getProvider(), info.getId());

        if (findMember.isEmpty()) {
            //회원이 존재하지 않는 경우
            MemberRequestDto memberRequestDto = MemberRequestDto.of(info.getEmail(), info.getProvider(), info.getId(),
                    null, "https://lwi.nexon.com/ca/common/info/character/cha1.png", 0, 0, Language.JAVA, null, 1,  Timestamp.valueOf(LocalDateTime.now()));



            Member member = memberRequestDto.toEntity();
            info.getAttributes().put("memberId",  memberRepository.save(member).getId());

            return member;
        } else {
            //회원이 존재하는 경우
            info.getAttributes().put("exist", true);
            info.getAttributes().put("memberId", findMember.get().getId());

            return findMember.get();
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


//@Transactional
//    public Long joinMember(MemberRequestDto memberRequestDto) {
//
//        Member member = memberRequestDto.toEntity();
//
//        //프로필이 없으면 기본 이미지 넣기
//        if(!StringUtils.hasText(memberRequestDto.getProfile())) {
//            member.updateProfile("https://lwi.nexon.com/ca/common/info/character/cha1.png");
//        }
//
//        return memberRepository.save(member).getId();
//    }

    @Transactional
    public String changeNickname(Long memberId, String newNickname) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("member Id에 해당하는 member가 없습니다."));

        member.updateNickname(newNickname);
        return memberRepository.save(member).getNickname();
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }


}