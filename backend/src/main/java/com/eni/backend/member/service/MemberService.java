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
import com.eni.backend.problem.entity.CodeStatus;
import com.eni.backend.problem.entity.Problem;
import com.eni.backend.problem.repository.CodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
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

    private static final int NUM_PROFILE_IMAGES = 10; // 프로필 사진의 개수

    @Transactional
    public LoginInfo loginOrJoinMember(Member member, boolean flag) {

        LoginInfo loginInfo;

        // 회원 정보가 있으면 해당 회원 리턴
        if (flag) {
            Optional<Member> optionalMember = memberRepository.findById(member.getId());
            Member findMember = optionalMember.get();

            loginInfo = LoginInfo.of(findMember.getId(), false, Objects.equals(findMember.getConnectedAt().toLocalDateTime().toLocalDate(), LocalDate.now()));

            // 회원이 로그인할 때 최종 접속시간 갱신
            findMember.updateConnectedAt(Timestamp.valueOf(LocalDateTime.now()));
        }
        // 없으면 새로 생성해서 리턴
        else {
            //레벨을 기본값을 1로 설정
            Optional<Level> defaultLevel = levelRepository.findById(1);
            defaultLevel.ifPresent(member::updateLevel);

            // 이메일을 기준으로 해시를 사용해 사용자 프로필 아바타 랜덤 지정
            member.updateProfile(selectRandomProfileImage(member.getEmail()));
            member.setDefaultCoin(2000);

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

        // 멤버가 가진 exp
        Integer memberExp = member.getExp();

        Optional<Level> optionalLevel = levelRepository.findById(member.getLevel().getId() - 1);

        Integer preLevelExp = 0;

        if (optionalLevel.isPresent()) {
            preLevelExp = optionalLevel.get().getExp();
        }

        // 현재 레벨의 최대 exp
        Integer tempLevelExp = member.getLevel().getExp();

        // 현재 레벨에서 채워진 EXP
        Integer responseExp = memberExp - preLevelExp;
        // 현재 레벨의 EXP 구간 넓이
        Integer responseExpLimit = tempLevelExp - preLevelExp;

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

        return GetMemberResponse.from(member, responseExp, responseExpLimit, getMemberItemListResponses);
    }

    public GetMemberDetailResponse getMemberDetails(Authentication authentication) {
        Member member = findMemberByAuthentication(authentication);

        if (member == null) {
            throw new CustomBadRequestException(MEMBER_NOT_FOUND);
        }

        List<Problem> successProblems = codeRepository.findAllByMemberAndCodeStatus(member, CodeStatus.SUCCESS);
        List<Problem> failProblems = codeRepository.findAllByMember(member);
        failProblems.removeAll(successProblems);

        List<String> newSuccessProblems = new ArrayList<>();
        List<String> newFailProblems = new ArrayList<>();

        for (Problem problem : successProblems) {
            String problemPlatform = problem.getStringPlatform();
            String problemNo = String.valueOf(problem.getNo());

            newSuccessProblems.add(problemPlatform + " " + problemNo);
        }

        for (Problem problem : failProblems) {
            String problemPlatform = problem.getStringPlatform();
            String problemNo = String.valueOf(problem.getNo());

            newFailProblems.add(problemPlatform + " " + problemNo);
        }

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

        if (member.getNickname().equals(putNicknameRequest.getNickname())) {
            throw new CustomBadRequestException(SAME_NICKNAME);
        }

        Optional<Member> existingMember = memberRepository.findByNickname(putNicknameRequest.getNickname());

        if (existingMember.isPresent()) {
            throw new CustomBadRequestException(DUPLICATED_NICKNAME);
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

        // EXP에 따른 레벨업
        List<Level> levelList = levelRepository.findAll();

        boolean levelUp = false;

        for (Level level : levelList) {
            if (Objects.equals(member.getLevel().getId(), level.getId())) {
                if (member.getExp() <= level.getExp()) {
                    break;
                } else {
                    member.updateLevel(levelRepository.findById(level.getId() + 1).get());
                    levelUp = true;
                }
            }
        }

        return PutRewardResponse.of(member.getId(), levelUp, member.getLevel().getId());
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

    public static String selectRandomProfileImage(String email) {
        int randomIndex = generateRandomIndex(email);

        return "profile" + (randomIndex + 1) + ".png";
    }

    private static int generateRandomIndex(String email) {
        // SecureRandom을 사용하여 email을 기반으로 랜덤한 난수 생성
        SecureRandom random = new SecureRandom(email.getBytes());

        return random.nextInt(MemberService.NUM_PROFILE_IMAGES);
    }
}