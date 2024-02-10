package com.eni.backend.member.service;

import com.eni.backend.auth.oauth2.user.LoginInfo;
import com.eni.backend.auth.oauth2.user.OAuth2Provider;
import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.exception.CustomServerErrorException;
import com.eni.backend.item.entity.Item;
import com.eni.backend.item.entity.MemberItem;
import com.eni.backend.item.repository.ItemRepository;
import com.eni.backend.item.repository.MemberItemRepository;
import com.eni.backend.member.dto.SecurityMemberDto;
import com.eni.backend.member.dto.request.PutCoinRequest;
import com.eni.backend.member.dto.request.PutLanguageRequest;
import com.eni.backend.member.dto.request.PutNicknameRequest;
import com.eni.backend.member.dto.request.PutRewardRequest;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.eni.backend.common.response.BaseResponseStatus.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final ItemRepository itemRepository;
    private final MemberItemRepository memberItemRepository;
    private final LevelRepository levelRepository;

    @Transactional
    public LoginInfo loginOrJoinMember(Member member, boolean flag) {

        LoginInfo loginInfo;

        // 회원 정보가 있으면 해당 회원 리턴
        if (flag) {
            // 회원이 로그인할 때 최종 접속시간 갱신
            member.updateConnectedAt(Timestamp.valueOf(LocalDateTime.now()));

            loginInfo = LoginInfo.of(member.getId(), false, Objects.equals(member.getConnectedAt().toLocalDateTime().toLocalDate(), LocalDate.now()));
        }
        // 없으면 새로 생성해서 리턴
        else {
            //레벨을 기본값을 1로 설정
            Optional<Level> defaultLevel = levelRepository.findById(1);
            defaultLevel.ifPresent(member::updateDefaultLevel);

            try {
                Long memberId = memberRepository.save(member).getId();
                loginInfo = LoginInfo.of(memberId, true, false);
            } catch (Exception e) {
                throw new CustomServerErrorException(DATABASE_ERROR);
            }
        }

        return loginInfo;
    }

    public Member validateMemberByToken(Long memberId) {
        return findMemberById(memberId)
                .orElseThrow(() -> new CustomBadRequestException(TOKEN_MISMATCH));
    }

    private Optional<Member> findMemberById(Long memberId) {

        return memberRepository.findById(memberId);
    }

    public Optional<Member> findBySocialIdAndProvider(String socialId, OAuth2Provider provider) {
        return memberRepository.findBySocialIdAndProvider(socialId, provider);
    }

    public List<GetMemberListResponse> getList() {
        return memberRepository.findAll()
                .stream().map(GetMemberListResponse::of)
                .collect(Collectors.toList());
    }

    public GetCoinResponse getCoin(Authentication authentication) {
        Member member = findMemberByAuthentication(authentication);

        Optional<Member> optionalMember = memberRepository.findById(member.getId());

        if (optionalMember.isEmpty()) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        return GetCoinResponse.of(optionalMember.get().getCoin());
    }

    public List<GetInventoryResponse> getInventory(Authentication authentication) {
        Member member = findMemberByAuthentication(authentication);
        List<Item> itemList = itemRepository.findAll();
        List<GetInventoryResponse> getInventoryResponseList = new ArrayList<>();

        if (member != null) {
            for (Item item : itemList) {

                Integer memberCount;
                Optional<MemberItem> optionalMemberItem = memberItemRepository.findMemberItemByMemberAndItem(member, item);

                if (optionalMemberItem.isPresent()) {
                    MemberItem memberItem = optionalMemberItem.get();
                    memberCount = memberItem.getCount();
                } else {
                    memberCount = 0;
                }

                getInventoryResponseList.add(GetInventoryResponse.from(member, item, memberCount));
            }
        }

        return getInventoryResponseList;
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