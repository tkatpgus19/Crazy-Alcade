package com.eni.backend.member.service;

import com.eni.backend.auth.oauth2.service.OAuth2UserPrincipal;
import com.eni.backend.auth.oauth2.user.LoginInfo;
import com.eni.backend.auth.oauth2.user.OAuth2UserInfo;
import com.eni.backend.common.exception.CustomServerErrorException;
import com.eni.backend.member.dto.SecurityMemberDto;
import com.eni.backend.member.dto.request.PutCoinRequest;
import com.eni.backend.member.dto.request.PutRewardRequest;
import com.eni.backend.member.dto.request.PutLanguageRequest;
import com.eni.backend.member.dto.request.PutNicknameRequest;
import com.eni.backend.member.dto.response.*;
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
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.eni.backend.common.response.BaseResponseStatus.DATABASE_ERROR;
import static com.eni.backend.common.response.BaseResponseStatus.MEMBER_NOT_FOUND;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final LevelRepository levelRepository;

    // true: 신규 회원, false: 기존 회원
    boolean isNew = true;

    // true: 로그인 보상 O, false: 로그인 보상 X
    boolean isConnected = true;
    
    @Transactional
    public LoginInfo loginOrJoinMember(OAuth2UserInfo info) {

        // DB에서 회원 정보 있는지 확인
        Optional<Member> findMember = memberRepository.findByProviderAndSocialId(
                info.getProvider(), info.getId());

        Member member;
        LoginInfo loginInfo;

        // 회원 정보가 있으면 해당 회원 리턴
        if (findMember.isPresent()) {
            //회원 정보 불러오기
            member = findMember.get();

            // 회원이 로그인할 때 최종 접속시간 갱신
            member.updateConnectedAt(Timestamp.valueOf(LocalDateTime.now()));

            loginInfo = LoginInfo.of(member, false, Objects.equals(member.getConnectedAt().toLocalDateTime().toLocalDate(), LocalDate.now()));
        }
        // 없으면 새로 생성해서 리턴
        else {
            member = Member.from(info);

            //레벨을 기본값을 1로 설정
            Optional<Level> defaultLevel = levelRepository.findById(1);
            defaultLevel.ifPresent(member::updateDefaultLevel);

            try {
                loginInfo = LoginInfo.of(memberRepository.save(member), true, false);
            } catch (Exception e) {
                throw new CustomServerErrorException(DATABASE_ERROR);
            }
        }

        return loginInfo;
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

//    public Member getAuthPrincipal(Authentication authentication) {
//        Object principalObject = authentication.getPrincipal();
//
//        if (principalObject instanceof SecurityMemberDto securityMemberDto) {
//
//            try {
//                Optional<Member> optionalMember = findMemberById(securityMemberDto.getId());
//                return optionalMember.get();
//            } catch (Exception e) {
//                throw new CustomServerErrorException(MEMBER_NOT_FOUND);
//            }
//        }
//
//        return null;
//    }

    public List<GetMemberListResponse> getList() {
        return memberRepository.findAll()
                .stream().map(GetMemberListResponse::of)
                .collect(Collectors.toList());
    }

    public PutNicknameResponse putNickname(Authentication authentication, PutNicknameRequest putNicknameRequest) {
        Member member = findMemberByAuthentication(authentication);

        if (member != null) {
            member.updateNickname(putNicknameRequest);
        }

        return PutNicknameResponse.of(member.getId());
    }

    public PutLanguageResponse putLanguage(Authentication authentication, PutLanguageRequest putLanguageRequest) {
        Member member = findMemberByAuthentication(authentication);

        if (member != null) {
            member.updateLanguage(putLanguageRequest);
        }

        return PutLanguageResponse.of(member.getId());
    }

    public PutCoinResponse putCoin(Authentication authentication, PutCoinRequest putCoinRequest, boolean operator) {
        Member member = findMemberByAuthentication(authentication);

        if (member != null) {
            member.updateCoin(putCoinRequest, operator);
        }

        return PutCoinResponse.of(member.getId());
    }

    public PutRewardResponse putReward(Authentication authentication, PutRewardRequest putRewardRequest) {
        Member member = findMemberByAuthentication(authentication);

        if (member != null) {
            member.putReward(putRewardRequest);
        }

        return PutRewardResponse.of(member.getId());
    }

    public Member findMemberByAuthentication(Authentication authentication) {
        Object principalObject = authentication.getPrincipal();

        if (principalObject instanceof SecurityMemberDto securityMemberDto) {

            try {
                Optional<Member> optionalMember = findMemberById(securityMemberDto.getId());
                return optionalMember.get();
            } catch (Exception e) {
                throw new CustomServerErrorException(MEMBER_NOT_FOUND);
            }
        }

        return null;
    }
}