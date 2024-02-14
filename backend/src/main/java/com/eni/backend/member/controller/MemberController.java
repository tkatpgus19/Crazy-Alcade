package com.eni.backend.member.controller;

import com.eni.backend.common.exception.CustomBadRequestException;
import com.eni.backend.common.response.BaseSuccessResponse;
import com.eni.backend.member.dto.request.PutCoinRequest;
import com.eni.backend.member.dto.request.PutLanguageRequest;
import com.eni.backend.member.dto.request.PutNicknameRequest;
import com.eni.backend.member.dto.request.PutRewardRequest;
import com.eni.backend.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import static com.eni.backend.common.response.BaseResponseStatus.*;
import static com.eni.backend.common.util.BindingResultUtils.getErrorMessages;

@Slf4j
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/memberlist")
    public BaseSuccessResponse<?> getList(Authentication authentication) {
        log.info("MemberController.getList");

        return BaseSuccessResponse.of(GET_MEMBER_LIST_SUCCESS, memberService.getList(authentication));
    }

    @GetMapping("")
    public BaseSuccessResponse<?> getMember(Authentication authentication) {
        log.info("MemberController.getMember");

        return BaseSuccessResponse.of(GET_MEMBER_SUCCESS, memberService.getMember(authentication));
    }

    @GetMapping("/details")
    public BaseSuccessResponse<?> getMemberDetails(Authentication authentication) {
        log.info("MemberController.getMemberDetails");

        return BaseSuccessResponse.of(GET_MEMBER_DETAILS_SUCCESS, memberService.getMemberDetails(authentication));
    }

    @GetMapping("/coin")
    public BaseSuccessResponse<?> getCoin(Authentication authentication) {
        log.info("MemberController.getCoin");

        return BaseSuccessResponse.of(GET_MEMBER_COIN_SUCCESS, memberService.getCoin(authentication));
    }

    @GetMapping("/inventory")
    public BaseSuccessResponse<?> getInventory(Authentication authentication) {
        log.info("MemberController.getInventory");

        return BaseSuccessResponse.of(GET_INVENTORY_SUCCESS, memberService.getInventory(authentication));
    }

    @PutMapping("/nickname")
    public BaseSuccessResponse<?> putNickname(Authentication authentication, @RequestBody @Valid PutNicknameRequest putNicknameRequest, BindingResult bindingResult) {
        log.info("MemberController.nickname.put");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(PUT_NICKNAME_SUCCESS, memberService.putNickname(authentication, putNicknameRequest));
    }

    @PutMapping("/lang")
    public BaseSuccessResponse<?> putLanguage(Authentication authentication, @RequestBody @Valid PutLanguageRequest putLanguageRequest, BindingResult bindingResult) {
        log.info("MemberController.language.put");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(PUT_LANGUAGE_SUCCESS, memberService.putLanguage(authentication, putLanguageRequest));

    }

    @PutMapping("/coin/add")
    public BaseSuccessResponse<?> putCoinAdd(Authentication authentication, @RequestBody @Valid PutCoinRequest putCoinRequest, BindingResult bindingResult) {
        log.info("MemberController.coin.add");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(PUT_COIN_ADD_SUCCESS, memberService.putCoin(authentication, putCoinRequest, true));
    }

    @PutMapping("/coin/sub")
    public BaseSuccessResponse<?> putCoinSub(Authentication authentication, @RequestBody @Valid PutCoinRequest putCoinRequest, BindingResult bindingResult) {
        log.info("MemberController.coin.sub");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(PUT_COIN_SUB_SUCCESS, memberService.putCoin(authentication, putCoinRequest, false));
    }

    @PutMapping("/reward")
    public BaseSuccessResponse<?> putExp(Authentication authentication, @RequestBody @Valid PutRewardRequest putRewardRequest, BindingResult bindingResult) {
        log.info("MemberController.reward");

        // validation 오류
        if (bindingResult.hasErrors()) {
            throw new CustomBadRequestException(BAD_REQUEST, getErrorMessages(bindingResult));
        }

        return BaseSuccessResponse.of(REWARD_ADD_SUCCESS, memberService.putReward(authentication, putRewardRequest));
    }
}