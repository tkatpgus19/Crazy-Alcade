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
import com.eni.backend.problem.entity.Code;
import com.eni.backend.problem.entity.CodeStatus;
import com.eni.backend.problem.repository.CodeRepository;
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
    private final CodeRepository codeRepository;
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

    public List<GetMemberListResponse> getList(Authentication authentication) {
        Member member = findMemberByAuthentication(authentication);

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        return memberRepository.findAll()
                .stream().map(GetMemberListResponse::of)
                .collect(Collectors.toList());
    }

    public GetMemberResponse getMember(Authentication authentication) {
        Member member = findMemberByAuthentication(authentication);

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        List<Item> itemList = itemRepository.findAll();
        List<GetMemberItemListResponse> getMemberItemListResponses = new ArrayList<>();

        for (Item item : itemList) {
            Integer memberItemCount;
            Optional<MemberItem> optionalMemberItem = memberItemRepository.findMemberItemByMemberAndItem(member, item);

            if (optionalMemberItem.isPresent()) {
                memberItemCount = optionalMemberItem.get().getCount();
            } else {
                memberItemCount = 0;
            }

            getMemberItemListResponses.add(GetMemberItemListResponse.from(item, memberItemCount));
        }

        return GetMemberResponse.from(member, getMemberItemListResponses);
    }

    public GetMemberDetailResponse getMemberDetails(Authentication authentication) {
        Member member = findMemberByAuthentication(authentication);

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        List<String> successProblems = new ArrayList<>();
        List<String> failProblems = new ArrayList<>();

        List<Code> codeList = codeRepository.findAllByMember(member);

        for (Code code : codeList) {
            String problemPlatform = code.getProblem().getStringPlatform();
            String problemNo = String.valueOf(code.getProblem().getNo());

            if (code.getStatus() == CodeStatus.SUCCESS) {
                successProblems.add(problemPlatform + " " + problemNo);

            } else if (code.getStatus() == CodeStatus.FAIL || code.getStatus() == CodeStatus.COMPILE_ERROR) {
                failProblems.add(problemPlatform + " " + problemNo);
            } else {
                throw new CustomServerErrorException(SERVER_ERROR);
            }
        }

        List<String> newSuccessProblems = successProblems.stream().distinct().toList();
        List<String> newFailProblems = failProblems.stream().distinct().toList();

        return GetMemberDetailResponse.from(member, newSuccessProblems, newFailProblems);
    }

    public GetCoinResponse getCoin(Authentication authentication) {
        Member member = findMemberByAuthentication(authentication);

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        return GetCoinResponse.of(member.getCoin());
    }

    public GetInventoryResponse getInventory(Authentication authentication) {
        Member member = findMemberByAuthentication(authentication);

        List<Item> itemList = itemRepository.findAll();
        List<GetItemInventoryResponse> getItemInventoryResponses = new ArrayList<>();

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        for (Item item : itemList) {

            Integer memberCount;
            Optional<MemberItem> optionalMemberItem = memberItemRepository.findMemberItemByMemberAndItem(member, item);

            if (optionalMemberItem.isPresent()) {
                memberCount = optionalMemberItem.get().getCount();
            } else {
                memberCount = 0;
            }

            getItemInventoryResponses.add(GetItemInventoryResponse.from(item, memberCount));
        }

        return GetInventoryResponse.from(member, getItemInventoryResponses);
    }

    public PutNicknameResponse putNickname(Authentication authentication, PutNicknameRequest putNicknameRequest) {
        Member member = findMemberByAuthentication(authentication);

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        member.updateNickname(putNicknameRequest);
        return PutNicknameResponse.of(member.getId());
    }

    public PutLanguageResponse putLanguage(Authentication authentication, PutLanguageRequest putLanguageRequest) {
        Member member = findMemberByAuthentication(authentication);

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        if (!putLanguageRequest.getLang().name().equals("JAVA") && !putLanguageRequest.getLang().name().equals("PYTHON")) {
            throw new CustomBadRequestException(MEMBER_LANG_CHANGE_FAIL);
        }

        member.updateLanguage(putLanguageRequest);

        return PutLanguageResponse.of(member.getId());
    }

    public PutCoinResponse putCoin(Authentication authentication, PutCoinRequest putCoinRequest, boolean operator) {
        Member member = findMemberByAuthentication(authentication);

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        if (!operator) {
            if (member.getCoin() < putCoinRequest.getPutValue() || member.getCoin() < 1) {
                throw new CustomBadRequestException(MEMBER_COIN_SUB_FAIL);
            }
        }

        member.updateCoin(putCoinRequest, operator);

        return PutCoinResponse.of(member.getId());
    }

    public PutRewardResponse putReward(Authentication authentication, PutRewardRequest putRewardRequest) {
        Member member = findMemberByAuthentication(authentication);

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        member.putReward(putRewardRequest);

        return PutRewardResponse.of(member.getId());
    }

    public Member findMemberByAuthentication(Authentication authentication) {
        Object principalObject = authentication.getPrincipal();

        if (principalObject instanceof SecurityMemberDto securityMemberDto) {

            Optional<Member> optionalMember = findMemberById(securityMemberDto.getId());

            if (optionalMember.isPresent()) {
                return optionalMember.get();
            }
        }

        throw new CustomServerErrorException(MEMBER_NOT_FOUND);
    }
}